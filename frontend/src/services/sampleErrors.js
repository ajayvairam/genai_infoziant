export const SAMPLE_ERRORS = [
  {
    id: "py-name-error",
    title: "Python NameError: name 'x' is not defined",
    language: "python",
    category: "Runtime Error",
    description: "Attempting to calculate with a variable before declaring or assigning it.",
    errorMessage: `Traceback (most recent call last):
  File "main.py", line 4, in <module>
    result = calculate_total(10)
  File "main.py", line 2, in calculate_total
    return price + x
NameError: name 'x' is not defined`,
    sourceCode: `def calculate_total(price):
    return price + x

result = calculate_total(10)
print(f"Total: {result}")`
  },
  {
    id: "js-type-error",
    title: "JavaScript TypeError: Cannot read properties of undefined (reading 'map')",
    language: "javascript",
    category: "Runtime Error",
    description: "Attempting to invoke .map() on an API response before data is loaded or when response is undefined.",
    errorMessage: `Uncaught TypeError: Cannot read properties of undefined (reading 'map')
    at renderUserList (app.js:5:21)
    at onload (app.js:12:3)`,
    sourceCode: `function renderUserList(response) {
  // Trying to map over users before checking if data exists
  const names = response.data.users.map(user => user.name);
  return names;
}

const apiResponse = { status: 200 };
renderUserList(apiResponse);`
  },
  {
    id: "java-null-pointer",
    title: "Java NullPointerException: Cannot invoke method on null object",
    language: "java",
    category: "Runtime Error",
    description: "Calling a method on an uninitialized reference variable in an object-oriented service class.",
    errorMessage: `Exception in thread "main" java.lang.NullPointerException: Cannot invoke "com.app.User.getName()" because "user" is null
	at com.app.UserService.formatUserName(UserService.java:18)
	at com.app.Main.main(Main.java:7)`,
    sourceCode: `public class UserService {
    public static class User {
        private String name;
        public String getName() { return name; }
    }

    public String formatUserName(User user) {
        // user is null when called
        return user.getName().toUpperCase();
    }

    public static void main(String[] args) {
        UserService service = new UserService();
        System.out.println(service.formatUserName(null));
    }
}`
  },
  {
    id: "c-undeclared-identifier",
    title: "C / C++: use of undeclared identifier & missing semicolon",
    language: "c",
    category: "Compilation Error",
    description: "Typo in variable declaration and omitted semicolon in classic C code.",
    errorMessage: `solution.c:6:5: error: use of undeclared identifier 'count'; did you mean 'cnt'?
    count++
    ^~~~~
    cnt
solution.c:6:12: error: expected ';' after expression
    count++
           ^
           ;
2 errors generated.`,
    sourceCode: `#include <stdio.h>

int main() {
    int cnt = 0;
    for (int i = 0; i < 5; i++) {
        count++
    }
    printf("Final count: %d\\n", cnt);
    return 0;
}`
  },
  {
    id: "sql-syntax-error",
    title: "SQL: Syntax error near misspelled keyword 'FORM'",
    language: "sql",
    category: "Syntax Error",
    description: "Common typo where 'FROM' is mistyped as 'FORM' inside a multi-table query.",
    errorMessage: `ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'FORM orders o JOIN users u ON o.user_id = u.id WHERE o.status = 'completed'' at line 2`,
    sourceCode: `SELECT o.id, o.amount, u.username
FORM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'completed'
ORDER BY o.created_at DESC;`
  },
  {
    id: "py-index-error",
    title: "Python IndexError: list index out of range",
    language: "python",
    category: "Runtime Error",
    description: "Iterating past the end of a list in a loop condition with `<=` instead of `<`.",
    errorMessage: `Traceback (most recent call last):
  File "process_scores.py", line 7, in <module>
    print(f"Student: {scores[i]}")
IndexError: list index out of range`,
    sourceCode: `scores = [95, 88, 72, 90]

# Off-by-one error using <= len(scores)
for i in range(len(scores) + 1):
    print(f"Student {i + 1}: {scores[i]}")`
  }
];
