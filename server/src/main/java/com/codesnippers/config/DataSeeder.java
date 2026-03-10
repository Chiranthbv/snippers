package com.codesnippers.config;

import com.codesnippers.model.Snippet;
import com.codesnippers.model.User;
import com.codesnippers.repository.SnippetRepository;
import com.codesnippers.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

        private final UserRepository userRepository;
        private final SnippetRepository snippetRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) {
                if (userRepository.count() > 0) {
                        log.info("Database already seeded, skipping...");
                        return;
                }

                log.info("Seeding Supabase database with popular sample data...");

                // Create Users
                User chiranth = userRepository.save(User.builder().username("chiranth").email("chiranth@example.com")
                                .password(passwordEncoder.encode("password123")).build());
                User alex = userRepository.save(User.builder().username("alexdev").email("alex@example.com")
                                .password(passwordEncoder.encode("password123")).build());
                User sarah = userRepository.save(User.builder().username("pythonista").email("sarah@example.com")
                                .password(passwordEncoder.encode("password123")).build());
                User mike = userRepository.save(User.builder().username("tsmaster").email("mike@example.com")
                                .password(passwordEncoder.encode("password123")).build());
                User jane = userRepository.save(User.builder().username("javaguru").email("jane@example.com")
                                .password(passwordEncoder.encode("password123")).build());
                User sys_dev = userRepository.save(User.builder().username("syseng").email("sys@example.com")
                                .password(passwordEncoder.encode("password123")).build());

                // 1. JavaScript - Debounce
                snippetRepository.save(Snippet.builder()
                                .title("Debounce Function (JavaScript)")
                                .content("function debounce(func, wait) {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}\n// Usage:\n// window.addEventListener('resize', debounce(() => console.log('resized'), 250));")
                                .language("javascript").visibility(Snippet.Visibility.PUBLIC).shortUrl("js-001")
                                .user(chiranth).build());

                // 2. JavaScript - Fetch API Wrapper
                snippetRepository.save(Snippet.builder()
                                .title("Fetch API Wrapper with Async/Await")
                                .content("async function fetchJSON(url, options = {}) {\n  try {\n    const response = await fetch(url, options);\n    if (!response.ok) {\n      throw new Error(`HTTP error! status: ${response.status}`);\n    }\n    return await response.json();\n  } catch (error) {\n    console.error('Fetch error:', error);\n    throw error;\n  }\n}\n// Usage:\n// const data = await fetchJSON('https://api.example.com/data');")
                                .language("javascript").visibility(Snippet.Visibility.PUBLIC).shortUrl("js-002")
                                .user(alex).build());

                // 3. Python - List Comprehensions & Maps
                snippetRepository.save(Snippet.builder()
                                .title("Advanced List Comprehensions")
                                .content("# Flatten 2D list\nmatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nflat = [x for row in matrix for x in row]\n\n# Dictionary comprehension\nsquares_dict = {x: x**2 for x in range(5)}\n\n# Filtering data\nevens = [x for x in range(20) if x % 2 == 0]")
                                .language("python").visibility(Snippet.Visibility.PUBLIC).shortUrl("py-001").user(sarah)
                                .build());

                // 4. Python - Decorator Pattern
                snippetRepository.save(Snippet.builder()
                                .title("Execution Time Decorator")
                                .content("import time\nimport functools\n\ndef timer(func):\n    @functools.wraps(func)\n    def wrapper_timer(*args, **kwargs):\n        start_time = time.perf_counter()\n        value = func(*args, **kwargs)\n        end_time = time.perf_counter()\n        run_time = end_time - start_time\n        print(f'Finished {func.__name__} in {run_time:.4f} secs')\n        return value\n    return wrapper_timer\n\n@timer\ndef waste_some_time(num_times):\n    for _ in range(num_times):\n        sum([i**2 for i in range(10000)])")
                                .language("python").visibility(Snippet.Visibility.PUBLIC).shortUrl("py-002").user(sarah)
                                .build());

                // 5. TypeScript - Utility Types
                snippetRepository.save(Snippet.builder()
                                .title("Deep Partial Utility Type")
                                .content("export type DeepPartial<T> = {\n  [P in keyof T]?: T[P] extends object\n    ? DeepPartial<T[P]>\n    : T[P];\n};\n\ninterface SystemConfig {\n  server: { host: string; port: number; ssl: boolean };\n  database: { url: string; poolSize: number };\n}\n\n// Allows partial nested updates\nconst update: DeepPartial<SystemConfig> = {\n  server: { port: 8080 }\n};")
                                .language("typescript").visibility(Snippet.Visibility.PUBLIC).shortUrl("ts-001")
                                .user(mike).build());

                // 6. TypeScript - Error Boundaries (React)
                snippetRepository.save(Snippet.builder()
                                .title("React Error Boundary Class Component")
                                .content("import React, { Component, ErrorInfo, ReactNode } from 'react';\n\ninterface Props { children: ReactNode; fallback: ReactNode; }\ninterface State { hasError: boolean; }\n\nexport class ErrorBoundary extends Component<Props, State> {\n  state: State = { hasError: false };\n\n  static getDerivedStateFromError(_: Error): State {\n    return { hasError: true };\n  }\n\n  componentDidCatch(error: Error, errorInfo: ErrorInfo) {\n    console.error('Uncaught error:', error, errorInfo);\n  }\n\n  render() {\n    if (this.state.hasError) return this.props.fallback;\n    return this.props.children;\n  }\n}")
                                .language("typescript").visibility(Snippet.Visibility.PUBLIC).shortUrl("ts-002")
                                .user(chiranth).build());

                // 7. Java - Stream API Mastery
                snippetRepository.save(Snippet.builder()
                                .title("Java Stream API Grouping & Reducing")
                                .content("import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class StreamExamples {\n  public static void main(String[] args) {\n    List<Order> orders = getOrders();\n\n    // Group by category and sum totals\n    Map<String, Double> totalsByCategory = orders.stream()\n        .collect(Collectors.groupingBy(\n            Order::getCategory,\n            Collectors.summingDouble(Order::getAmount)\n        ));\n\n    // Get top 3 most expensive items\n    List<Order> topOrders = orders.stream()\n        .sorted(Comparator.comparingDouble(Order::getAmount).reversed())\n        .limit(3)\n        .toList();\n  }\n}")
                                .language("java").visibility(Snippet.Visibility.PUBLIC).shortUrl("jv-001").user(jane)
                                .build());

                // 8. Go - Goroutines & Channels
                snippetRepository.save(Snippet.builder()
                                .title("Concurrent Worker Pool Pattern")
                                .content("package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\nfunc worker(id int, jobs <-chan int, results chan<- int) {\n\tfor j := range jobs {\n\t\tfmt.Printf(\"Worker %d processing job %d\\n\", id, j)\n\t\tresults <- j * 2\n\t}\n}\n\nfunc main() {\n\tconst numJobs = 10\n\tjobs := make(chan int, numJobs)\n\tresults := make(chan int, numJobs)\n\n\t// Start 3 workers\n\tvar wg sync.WaitGroup\n\tfor w := 1; w <= 3; w++ {\n\t\twg.Add(1)\n\t\tgo func(workerID int) {\n\t\t\tdefer wg.Done()\n\t\t\tworker(workerID, jobs, results)\n\t\t}(w)\n\t}\n\n\tfor j := 1; j <= numJobs; j++ {\n\t\tjobs <- j\n\t}\n\tclose(jobs)\n\n\twg.Wait()\n\tclose(results)\n}")
                                .language("go").visibility(Snippet.Visibility.PUBLIC).shortUrl("go-001").user(sys_dev)
                                .build());

                // 9. Rust - Result / Error Handling
                snippetRepository.save(Snippet.builder()
                                .title("Idiomatic File Reading & Error Propagation")
                                .content("use std::fs::File;\nuse std::io::{self, Read};\nuse std::path::Path;\n\n// Using '?' to propagate errors cleanly\nfn read_username_from_file<P: AsRef<Path>>(path: P) -> Result<String, io::Error> {\n    let mut username = String::new();\n    File::open(path)?.read_to_string(&mut username)?;\n    Ok(username.trim().to_string())\n}\n\nfn main() {\n    match read_username_from_file(\"hello.txt\") {\n        Ok(name) => println!(\"Found username: {}\", name),\n        Err(e) => eprintln!(\"Error reading file: {}\", e),\n    }\n}")
                                .language("rust").visibility(Snippet.Visibility.PUBLIC).shortUrl("rs-001").user(sys_dev)
                                .build());

                // 10. React Hooks - useLocalStorage
                snippetRepository.save(Snippet.builder()
                                .title("Custom React Hook: useLocalStorage")
                                .content("import { useState, useEffect } from 'react';\n\nexport function useLocalStorage<T>(key: string, initialValue: T) {\n  const [value, setValue] = useState<T>(() => {\n    if (typeof window === 'undefined') return initialValue;\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      console.warn('Error reading localStorage', error);\n      return initialValue;\n    }\n  });\n\n  useEffect(() => {\n    try {\n      window.localStorage.setItem(key, JSON.stringify(value));\n    } catch (error) {\n      console.warn('Error setting localStorage', error);\n    }\n  }, [key, value]);\n\n  return [value, setValue] as const;\n}")
                                .language("typescript").visibility(Snippet.Visibility.PUBLIC).shortUrl("ts-003")
                                .user(chiranth).build());

                // 11. CSS - Modern Glassmorphism
                snippetRepository.save(Snippet.builder()
                                .title("CSS Glassmorphism Card Effect")
                                .content(".glass-card {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(16px);\n  -webkit-backdrop-filter: blur(16px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 16px;\n  padding: 32px;\n  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);\n  color: white;\n}\n\n/* Subtle hover glow */\n.glass-card:hover {\n  border-color: rgba(255, 255, 255, 0.2);\n  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.05);\n}")
                                .language("css").visibility(Snippet.Visibility.PUBLIC).shortUrl("cs-001").user(chiranth)
                                .build());

                // 12. SQL - Tree / Hierarchical Queries
                snippetRepository.save(Snippet.builder()
                                .title("Recursive CTE (PostgreSQL)")
                                .content("-- Get an employee hierarchy\nWITH RECURSIVE employee_tree AS (\n    -- Base case: Top level managers\n    SELECT id, name, manager_id, 1 AS depth\n    FROM employees\n    WHERE manager_id IS NULL\n\n    UNION ALL\n\n    -- Recursive step: Employees reporting to the above\n    SELECT e.id, e.name, e.manager_id, et.depth + 1\n    FROM employees e\n    INNER JOIN employee_tree et ON e.manager_id = et.id\n)\nSELECT * FROM employee_tree\nORDER BY depth, manager_id;")
                                .language("sql").visibility(Snippet.Visibility.PUBLIC).shortUrl("sq-001").user(sys_dev)
                                .build());

                // 13. Python - FastAPI Starter
                snippetRepository.save(Snippet.builder()
                                .title("FastAPI Basic Async Endpoint")
                                .content("from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Item(BaseModel):\n    name: str\n    price: float\n    in_stock: bool = True\n\n@app.post(\"/items/\")\nasync def create_item(item: Item):\n    if item.price < 0:\n        raise HTTPException(status_code=400, detail=\"Price cannot be negative\")\n    # Database insertion logic here\n    return {\"status\": \"success\", \"item\": item}")
                                .language("python").visibility(Snippet.Visibility.PUBLIC).shortUrl("py-003").user(sarah)
                                .build());

                // 14. JavaScript - Deep Clone
                snippetRepository.save(Snippet.builder()
                                .title("Object Deep Clone function")
                                .content("function deepClone(obj) {\n  if (obj === null || typeof obj !== 'object') {\n    return obj;\n  }\n  \n  if (obj instanceof Date) return new Date(obj.getTime());\n  if (obj instanceof Array) return obj.map(item => deepClone(item));\n  if (obj instanceof RegExp) return new RegExp(obj);\n  \n  let clonedObj = {};\n  for (let key in obj) {\n    if (obj.hasOwnProperty(key)) {\n      clonedObj[key] = deepClone(obj[key]);\n    }\n  }\n  return clonedObj;\n}\n\n// NOTE: In modern JS, you can also use structuredClone(obj)")
                                .language("javascript").visibility(Snippet.Visibility.PUBLIC).shortUrl("js-003")
                                .user(alex).build());

                // 15. Bash - Automation Script
                snippetRepository.save(Snippet.builder()
                                .title("Directory Backup Script with Tar")
                                .content("#!/bin/bash\n\n# Usage: ./backup.sh /path/to/folder\nif [ -z \"$1\" ]; then\n  echo \"Please provide a directory path\"\n  exit 1\nfi\n\nDIR=$1\nBACKUP_DIR=\"/backup\"\nTIMESTAMP=$(date +\"%Y%m%d_%H%M%S\")\nFILENAME=\"backup_$(basename $DIR)_$TIMESTAMP.tar.gz\"\n\necho \"Starting backup of $DIR ...\"\ntar -czf \"$BACKUP_DIR/$FILENAME\" \"$DIR\"\n\nif [ $? -eq 0 ]; then\n  echo \"Backup successful: $BACKUP_DIR/$FILENAME\"\nelse\n  echo \"Backup failed!\"\nfi")
                                .language("bash").visibility(Snippet.Visibility.PUBLIC).shortUrl("sh-001").user(sys_dev)
                                .build());

                log.info("Successfully seeded users and popular code snippets");
        }
}
