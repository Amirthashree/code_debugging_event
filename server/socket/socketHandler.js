const activeSocketUsers = new Map();

function initSocketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join contest room with user metadata
    socket.on('user:join', (userData) => {
      if (userData && userData.id) {
        activeSocketUsers.set(socket.id, userData);
        socket.join('contest_room');
        console.log(`User ${userData.username} (${userData.role}) joined contest_room`);

        // Emit active user count refresh to admin monitors
        io.to('contest_room').emit('participants:active_count', {
          count: activeSocketUsers.size
        });
      }
    });

    // Real-time violation telemetry stream
    socket.on('anti_cheat:violation', (data) => {
      console.log(`[AntiCheat Alert] User ${data.username} triggered: ${data.type}`);
      io.to('contest_room').emit('admin:violation_stream', {
        ...data,
        timestamp: new Date()
      });
    });

    // Code auto-save beacon (optional editor synchronization)
    socket.on('editor:auto_save', (data) => {
      socket.to('contest_room').emit('editor:participant_synced', {
        userId: data.userId,
        questionId: data.questionId,
        timestamp: Date.now()
      });
    });

    socket.on('disconnect', () => {
      const user = activeSocketUsers.get(socket.id);
      if (user) {
        console.log(`Socket disconnected: ${user.username}`);
        activeSocketUsers.delete(socket.id);
        io.to('contest_room').emit('participants:active_count', {
          count: activeSocketUsers.size
        });
      }
    });
  });
}

module.exports = { initSocketHandler, activeSocketUsers };
