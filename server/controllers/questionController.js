const Question = require('../models/Question');
const { getIsMockMode } = require('../config/db');

// Default initial question set for Dev Dynasty Debugging Contest
const defaultQuestions = [
  {
    _id: 'q1_fibonacci',
    title: 'Fix Fibonacci Sequence Logic',
    slug: 'fix-fibonacci-sequence-logic',
    description: 'The provided code for calculating the N-th Fibonacci number has an off-by-one bug in loop condition and base case return value. Fix the logic so that `fib(0) = 0`, `fib(1) = 1`, `fib(5) = 5`, `fib(7) = 13`.',
    difficulty: 'easy',
    category: 'Array & Recursion',
    points: 100,
    buggyCode: {
      python: `# Buggy Fibonacci Implementation\ndef fibonacci(n):\n    if n <= 0:\n        return 1  # Bug: should return 0\n    if n == 1:\n        return 1\n    a, b = 0, 1\n    for i in range(2, n):  # Bug: range excludes n\n        a, b = b, a + b\n    return b\n\nimport sys\nif __name__ == '__main__':\n    inp = sys.stdin.read().strip()\n    if inp:\n        print(fibonacci(int(inp)))`,
      java: `// Buggy Fibonacci Implementation\nimport java.util.Scanner;\n\npublic class Solution {\n    public static int fibonacci(int n) {\n        if (n <= 0) return 1; // Bug: should return 0\n        if (n == 1) return 1;\n        int a = 0, b = 1;\n        for (int i = 2; i < n; i++) { // Bug: loop condition\n            int temp = a + b;\n            a = b;\n            b = temp;\n        }\n        return b;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            System.out.println(fibonacci(sc.nextInt()));\n        }\n    }\n}`,
      c: `// Buggy Fibonacci Implementation in C\n#include <stdio.h>\n\nint fibonacci(int n) {\n    if (n <= 0) return 1; // Bug: should return 0\n    if (n == 1) return 1;\n    int a = 0, b = 1;\n    for (int i = 2; i < n; i++) { // Bug\n        int temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        printf("%d\\n", fibonacci(n));\n    }\n    return 0;\n}`,
      cpp: `// Buggy Fibonacci Implementation in C++\n#include <iostream>\nusing namespace std;\n\nint fibonacci(int n) {\n    if (n <= 0) return 1; // Bug\n    if (n == 1) return 1;\n    int a = 0, b = 1;\n    for (int i = 2; i < n; i++) {\n        int temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        cout << fibonacci(n) << endl;\n    }\n    return 0;\n}`
    },
    solutionCode: {
      python: `def fibonacci(n):\n    if n <= 0:\n        return 0\n    if n == 1:\n        return 1\n    a, b = 0, 1\n    for i in range(2, n + 1):\n        a, b = b, a + b\n    return b\n\nimport sys\nif __name__ == '__main__':\n    inp = sys.stdin.read().strip()\n    if inp:\n        print(fibonacci(int(inp)))`,
      java: `import java.util.Scanner;\n\npublic class Solution {\n    public static int fibonacci(int n) {\n        if (n <= 0) return 0;\n        if (n == 1) return 1;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int temp = a + b;\n            a = b;\n            b = temp;\n        }\n        return b;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            System.out.println(fibonacci(sc.nextInt()));\n        }\n    }\n}`,
      c: `#include <stdio.h>\n\nint fibonacci(int n) {\n    if (n <= 0) return 0;\n    if (n == 1) return 1;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        printf("%d\\n", fibonacci(n));\n    }\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint fibonacci(int n) {\n    if (n <= 0) return 0;\n    if (n == 1) return 1;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        cout << fibonacci(n) << endl;\n    }\n    return 0;\n}`
    },
    testCases: [
      { input: '0', expectedOutput: '0', isPublic: true },
      { input: '1', expectedOutput: '1', isPublic: true },
      { input: '5', expectedOutput: '5', isPublic: true },
      { input: '7', expectedOutput: '13', isPublic: false },
      { input: '10', expectedOutput: '55', isPublic: false }
    ],
    hint: 'Check base case returns for n=0 and inspect the loop range endpoint!',
    order: 1
  },
  {
    _id: 'q2_palindrome',
    title: 'Palindrome String Verifier Bug',
    slug: 'palindrome-string-verifier-bug',
    description: 'The code checks if an input string is a valid palindrome, ignoring spaces and case. However, it currently reverses the string incorrectly and fails to normalize punctuation.',
    difficulty: 'medium',
    category: 'String Manipulation',
    points: 150,
    buggyCode: {
      python: `# Buggy Palindrome Check\ndef is_palindrome(s):\n    cleaned = s.lower()  # Bug: forgot to strip non-alphanumeric chars\n    return cleaned == cleaned[::1]  # Bug: slice direction is [::1] instead of [::-1]\n\nimport sys\nif __name__ == '__main__':\n    inp = sys.stdin.read().strip()\n    print("true" if is_palindrome(inp) else "false")`,
      java: `import java.util.Scanner;\n\npublic class Solution {\n    public static boolean isPalindrome(String s) {\n        String cleaned = s.toLowerCase(); // Bug: non-alphanumeric not removed\n        String rev = new StringBuilder(cleaned).toString(); // Bug: forgot .reverse()\n        return cleaned.equals(rev);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLine()) {\n            System.out.println(isPalindrome(sc.nextLine()) ? "true" : "false");\n        }\n    }\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\n\nint isPalindrome(char *s) {\n    int len = strlen(s);\n    for(int i=0; i<len; i++) {\n        if(s[i] != s[len-1]) return 0; // Bug: pointer comparison without increment/decrement\n    }\n    return 1;\n}\n\nint main() {\n    char str[100];\n    if (fgets(str, sizeof(str), stdin)) {\n        str[strcspn(str, "\\n")] = 0;\n        printf("%s\\n", isPalindrome(str) ? "true" : "false");\n    }\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    string cleaned = "";\n    for(char c : s) if(isalnum(c)) cleaned += tolower(c);\n    string rev = cleaned; // Bug: forgot to reverse\n    return cleaned == rev;\n}\n\nint main() {\n    string s;\n    if (getline(cin, s)) {\n        cout << (isPalindrome(s) ? "true" : "false") << endl;\n    }\n    return 0;\n}`
    },
    solutionCode: {
      python: `def is_palindrome(s):\n    cleaned = "".join(c.lower() for c in s if c.isalnum())\n    return cleaned == cleaned[::-1]\n\nimport sys\nif __name__ == '__main__':\n    inp = sys.stdin.read().strip()\n    print("true" if is_palindrome(inp) else "false")`,
      java: `import java.util.Scanner;\n\npublic class Solution {\n    public static boolean isPalindrome(String s) {\n        StringBuilder cleaned = new StringBuilder();\n        for (char c : s.toCharArray()) {\n            if (Character.isLetterOrDigit(c)) cleaned.append(Character.toLowerCase(c));\n        }\n        return cleaned.toString().equals(cleaned.reverse().toString());\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLine()) {\n            System.out.println(isPalindrome(sc.nextLine()) ? "true" : "false");\n        }\n    }\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\n\nint isPalindrome(char *s) {\n    int l = 0, r = strlen(s) - 1;\n    while (l < r) {\n        while (l < r && !isalnum(s[l])) l++;\n        while (l < r && !isalnum(s[r])) r--;\n        if (tolower(s[l]) != tolower(s[r])) return 0;\n        l++; r--;\n    }\n    return 1;\n}\n\nint main() {\n    char str[100];\n    if (fgets(str, sizeof(str), stdin)) {\n        str[strcspn(str, "\\n")] = 0;\n        printf("%s\\n", isPalindrome(str) ? "true" : "false");\n    }\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    string cleaned = "";\n    for(char c : s) if(isalnum(c)) cleaned += tolower(c);\n    string rev = cleaned;\n    reverse(rev.begin(), rev.end());\n    return cleaned == rev;\n}\n\nint main() {\n    string s;\n    if (getline(cin, s)) {\n        cout << (isPalindrome(s) ? "true" : "false") << endl;\n    }\n    return 0;\n}`
    },
    testCases: [
      { input: 'racecar', expectedOutput: 'true', isPublic: true },
      { input: 'hello', expectedOutput: 'false', isPublic: true },
      { input: 'A man, a plan, a canal: Panama', expectedOutput: 'true', isPublic: false }
    ],
    hint: 'Ensure you reverse the stripped alphanumeric string!',
    order: 2
  }
];

const memoryQuestions = new Map(defaultQuestions.map(q => [q._id, q]));

/**
 * @route GET /api/questions
 */
const getQuestions = async (req, res) => {
  try {
    if (!getIsMockMode()) {
      let questions = await Question.find().sort({ order: 1 });
      if (questions.length === 0) {
        questions = await Question.insertMany(defaultQuestions);
      }
      return res.json(questions);
    } else {
      return res.json(Array.from(memoryQuestions.values()));
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

/**
 * @route GET /api/questions/:id
 */
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!getIsMockMode()) {
      const q = await Question.findById(id);
      if (!q) return res.status(404).json({ message: 'Question not found' });
      return res.json(q);
    } else {
      const q = memoryQuestions.get(id) || Array.from(memoryQuestions.values()).find(item => item._id === id || item.slug === id);
      if (!q) return res.status(404).json({ message: 'Question not found' });
      return res.json(q);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching question' });
  }
};

/**
 * @route POST /api/questions (Admin)
 */
const createQuestion = async (req, res) => {
  try {
    const questionData = req.body;
    questionData.slug = questionData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (!getIsMockMode()) {
      const newQ = await Question.create(questionData);
      return res.status(201).json(newQ);
    } else {
      const newId = 'q_' + Date.now();
      const newQ = { _id: newId, ...questionData };
      memoryQuestions.set(newId, newQ);
      return res.status(201).json(newQ);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating question' });
  }
};

/**
 * @route PUT /api/questions/:id (Admin)
 */
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!getIsMockMode()) {
      const updated = await Question.findByIdAndUpdate(id, req.body, { new: true });
      return res.json(updated);
    } else {
      const existing = memoryQuestions.get(id);
      if (!existing) return res.status(404).json({ message: 'Question not found' });
      const updated = { ...existing, ...req.body };
      memoryQuestions.set(id, updated);
      return res.json(updated);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating question' });
  }
};

/**
 * @route DELETE /api/questions/:id (Admin)
 */
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!getIsMockMode()) {
      await Question.findByIdAndDelete(id);
    } else {
      memoryQuestions.delete(id);
    }
    return res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question' });
  }
};

module.exports = { getQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion, memoryQuestions };
