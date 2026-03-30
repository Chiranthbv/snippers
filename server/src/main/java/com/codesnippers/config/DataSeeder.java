package com.codesnippers.config;

import com.codesnippers.model.Snippet;
import com.codesnippers.model.User;
import com.codesnippers.repository.SnippetRepository;
import com.codesnippers.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(1)
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SnippetRepository snippetRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create seed users if they don't exist
        User u1 = getOrCreateUser("chiranth", "chiranth@codesnippers.dev");
        User u2 = getOrCreateUser("alexdev", "alex@codesnippers.dev");
        User u3 = getOrCreateUser("pythonista", "sarah@codesnippers.dev");
        User u4 = getOrCreateUser("tsmaster", "mike@codesnippers.dev");
        User u5 = getOrCreateUser("javaguru", "jane@codesnippers.dev");
        User u6 = getOrCreateUser("syseng", "sys@codesnippers.dev");

        log.info("Seeding permanent code snippets (idempotent)...");
        int added = 0;

        // 1. JS Debounce
        added += seed("js-001", "Debounce Function", "javascript",
            "function debounce(func, wait) {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}\n\n// Usage:\nwindow.addEventListener('resize', debounce(() => {\n  console.log('Window resized');\n}, 250));", u1);

        // 2. JS Fetch Wrapper
        added += seed("js-002", "Async Fetch API Wrapper", "javascript",
            "async function fetchJSON(url, options = {}) {\n  try {\n    const response = await fetch(url, {\n      headers: { 'Content-Type': 'application/json' },\n      ...options,\n    });\n    if (!response.ok) {\n      throw new Error(`HTTP ${response.status}`);\n    }\n    return await response.json();\n  } catch (error) {\n    console.error('Fetch failed:', error);\n    throw error;\n  }\n}\n\n// Usage:\nconst data = await fetchJSON('/api/users');", u2);

        // 3. JS Deep Clone
        added += seed("js-003", "Deep Clone Object", "javascript",
            "function deepClone(obj) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (obj instanceof Date) return new Date(obj.getTime());\n  if (obj instanceof Array) return obj.map(item => deepClone(item));\n  if (obj instanceof RegExp) return new RegExp(obj);\n\n  const cloned = {};\n  for (const key in obj) {\n    if (obj.hasOwnProperty(key)) {\n      cloned[key] = deepClone(obj[key]);\n    }\n  }\n  return cloned;\n}\n\n// Modern alternative: structuredClone(obj)", u2);

        // 4. JS Array Utilities
        added += seed("js-004", "Array Utility Functions", "javascript",
            "// Remove duplicates\nconst unique = arr => [...new Set(arr)];\n\n// Chunk array into groups\nconst chunk = (arr, size) =>\n  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>\n    arr.slice(i * size, i * size + size)\n  );\n\n// Shuffle array (Fisher-Yates)\nfunction shuffle(arr) {\n  const a = [...arr];\n  for (let i = a.length - 1; i > 0; i--) {\n    const j = Math.floor(Math.random() * (i + 1));\n    [a[i], a[j]] = [a[j], a[i]];\n  }\n  return a;\n}\n\n// Flatten nested arrays\nconst flatten = arr => arr.flat(Infinity);", u1);

        // 5. JS Event Emitter
        added += seed("js-005", "Simple Event Emitter", "javascript",
            "class EventEmitter {\n  constructor() {\n    this.events = {};\n  }\n\n  on(event, callback) {\n    if (!this.events[event]) this.events[event] = [];\n    this.events[event].push(callback);\n    return () => this.off(event, callback);\n  }\n\n  off(event, callback) {\n    this.events[event] = this.events[event]?.filter(cb => cb !== callback);\n  }\n\n  emit(event, ...args) {\n    this.events[event]?.forEach(cb => cb(...args));\n  }\n}\n\n// Usage:\nconst bus = new EventEmitter();\nbus.on('message', data => console.log(data));\nbus.emit('message', 'Hello!');", u1);

        // 6. Python Decorators
        added += seed("py-001", "Useful Python Decorators", "python",
            "import functools\nimport time\n\ndef timer(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f'{func.__name__} took {elapsed:.4f}s')\n        return result\n    return wrapper\n\ndef retry(max_attempts=3, delay=1):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            for attempt in range(max_attempts):\n                try:\n                    return func(*args, **kwargs)\n                except Exception as e:\n                    if attempt == max_attempts - 1:\n                        raise\n                    time.sleep(delay)\n        return wrapper\n    return decorator\n\n@timer\n@retry(max_attempts=3)\ndef fetch_data(url):\n    pass", u3);

        // 7. Python List Comprehensions
        added += seed("py-002", "Advanced List Comprehensions", "python",
            "# Flatten 2D list\nmatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nflat = [x for row in matrix for x in row]\n\n# Dict comprehension with condition\nscores = {'alice': 92, 'bob': 78, 'carol': 85, 'dave': 61}\npassed = {k: v for k, v in scores.items() if v >= 70}\n\n# Nested comprehension - transpose matrix\ntransposed = [[row[i] for row in matrix] for i in range(len(matrix[0]))]\n\n# Generate pairs\npairs = [(x, y) for x in range(3) for y in range(3) if x != y]\n\n# Walrus operator (Python 3.8+)\nresults = [y for x in range(10) if (y := x**2) > 20]", u3);

        // 8. Python FastAPI
        added += seed("py-003", "FastAPI CRUD Endpoints", "python",
            "from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\nfrom typing import Optional\n\napp = FastAPI()\n\nclass Item(BaseModel):\n    name: str\n    price: float\n    in_stock: bool = True\n\ndb: dict[int, Item] = {}\nnext_id = 1\n\n@app.post('/items/', status_code=201)\nasync def create_item(item: Item):\n    global next_id\n    db[next_id] = item\n    next_id += 1\n    return {'id': next_id - 1, **item.dict()}\n\n@app.get('/items/{item_id}')\nasync def get_item(item_id: int):\n    if item_id not in db:\n        raise HTTPException(404, 'Item not found')\n    return db[item_id]\n\n@app.delete('/items/{item_id}')\nasync def delete_item(item_id: int):\n    if item_id not in db:\n        raise HTTPException(404, 'Item not found')\n    del db[item_id]\n    return {'message': 'Deleted'}", u3);

        // 9. Python File Operations
        added += seed("py-004", "File Operations & Context Managers", "python",
            "import json\nimport csv\nfrom pathlib import Path\nfrom contextlib import contextmanager\n\n# Read/write JSON\ndef load_json(filepath):\n    with open(filepath) as f:\n        return json.load(f)\n\ndef save_json(filepath, data):\n    with open(filepath, 'w') as f:\n        json.dump(data, f, indent=2)\n\n# Read CSV as list of dicts\ndef read_csv(filepath):\n    with open(filepath) as f:\n        return list(csv.DictReader(f))\n\n# Custom context manager\n@contextmanager\ndef temp_directory():\n    import tempfile, shutil\n    tmpdir = tempfile.mkdtemp()\n    try:\n        yield Path(tmpdir)\n    finally:\n        shutil.rmtree(tmpdir)\n\n# Usage:\nwith temp_directory() as d:\n    (d / 'test.txt').write_text('hello')", u3);

        // 10. Python Async
        added += seed("py-005", "Async Concurrent Requests", "python",
            "import asyncio\nimport aiohttp\n\nasync def fetch(session, url):\n    async with session.get(url) as resp:\n        return await resp.json()\n\nasync def fetch_all(urls):\n    async with aiohttp.ClientSession() as session:\n        tasks = [fetch(session, url) for url in urls]\n        return await asyncio.gather(*tasks)\n\n# With rate limiting\nasync def fetch_limited(urls, max_concurrent=5):\n    semaphore = asyncio.Semaphore(max_concurrent)\n    async with aiohttp.ClientSession() as session:\n        async def limited_fetch(url):\n            async with semaphore:\n                return await fetch(session, url)\n        return await asyncio.gather(\n            *[limited_fetch(u) for u in urls]\n        )\n\n# Usage:\nurls = [f'https://api.example.com/{i}' for i in range(20)]\nresults = asyncio.run(fetch_limited(urls))", u3);

        // 11. TypeScript Utility Types
        added += seed("ts-001", "TypeScript Utility Types", "typescript",
            "// Deep Partial - makes all nested properties optional\ntype DeepPartial<T> = {\n  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];\n};\n\n// Require specific keys\ntype RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;\n\n// Make specific keys optional\ntype PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;\n\n// Extract function return type\ntype AsyncReturnType<T extends (...args: any) => Promise<any>> =\n  T extends (...args: any) => Promise<infer R> ? R : never;\n\n// Usage:\ninterface Config {\n  db: { host: string; port: number };\n  cache: { ttl: number };\n}\n\nconst partial: DeepPartial<Config> = { db: { port: 5432 } };", u4);

        // 12. TS React Hook
        added += seed("ts-002", "Custom React Hook: useLocalStorage", "typescript",
            "import { useState, useEffect } from 'react';\n\nexport function useLocalStorage<T>(key: string, initial: T) {\n  const [value, setValue] = useState<T>(() => {\n    if (typeof window === 'undefined') return initial;\n    try {\n      const item = localStorage.getItem(key);\n      return item ? JSON.parse(item) : initial;\n    } catch {\n      return initial;\n    }\n  });\n\n  useEffect(() => {\n    try {\n      localStorage.setItem(key, JSON.stringify(value));\n    } catch (err) {\n      console.warn('localStorage write failed:', err);\n    }\n  }, [key, value]);\n\n  return [value, setValue] as const;\n}\n\n// Usage:\nconst [theme, setTheme] = useLocalStorage('theme', 'dark');", u4);

        // 13. TS React Error Boundary
        added += seed("ts-003", "React Error Boundary Component", "typescript",
            "import React, { Component, ErrorInfo, ReactNode } from 'react';\n\ninterface Props {\n  children: ReactNode;\n  fallback?: ReactNode;\n}\n\ninterface State {\n  hasError: boolean;\n  error?: Error;\n}\n\nexport class ErrorBoundary extends Component<Props, State> {\n  state: State = { hasError: false };\n\n  static getDerivedStateFromError(error: Error): State {\n    return { hasError: true, error };\n  }\n\n  componentDidCatch(error: Error, info: ErrorInfo) {\n    console.error('Error caught by boundary:', error, info);\n  }\n\n  render() {\n    if (this.state.hasError) {\n      return this.props.fallback || (\n        <div style={{ padding: 20, textAlign: 'center' }}>\n          <h2>Something went wrong</h2>\n          <pre>{this.state.error?.message}</pre>\n        </div>\n      );\n    }\n    return this.props.children;\n  }\n}", u1);

        // 14. TS Zod Validation
        added += seed("ts-004", "Zod Schema Validation", "typescript",
            "import { z } from 'zod';\n\n// Define schemas\nconst UserSchema = z.object({\n  name: z.string().min(2).max(50),\n  email: z.string().email(),\n  age: z.number().int().min(13).max(120),\n  role: z.enum(['admin', 'user', 'moderator']),\n  bio: z.string().optional(),\n});\n\n// Infer TypeScript type from schema\ntype User = z.infer<typeof UserSchema>;\n\n// Validate data\nfunction validateUser(data: unknown): User {\n  return UserSchema.parse(data);\n}\n\n// Safe validation (no throw)\nfunction safeValidate(data: unknown) {\n  const result = UserSchema.safeParse(data);\n  if (!result.success) {\n    console.error(result.error.flatten());\n    return null;\n  }\n  return result.data;\n}", u4);

        // 15. TS Fetch with Types
        added += seed("ts-005", "Type-Safe API Client", "typescript",
            "interface ApiResponse<T> {\n  data: T;\n  status: number;\n  message: string;\n}\n\nasync function api<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {\n  const res = await fetch(`/api${endpoint}`, {\n    headers: { 'Content-Type': 'application/json' },\n    ...options,\n  });\n\n  if (!res.ok) {\n    throw new Error(`API Error: ${res.status} ${res.statusText}`);\n  }\n\n  return res.json();\n}\n\n// Typed API methods\nconst userApi = {\n  getAll: () => api<User[]>('/users'),\n  getById: (id: number) => api<User>(`/users/${id}`),\n  create: (data: Omit<User, 'id'>) =>\n    api<User>('/users', {\n      method: 'POST',\n      body: JSON.stringify(data),\n    }),\n  delete: (id: number) =>\n    api<void>(`/users/${id}`, { method: 'DELETE' }),\n};", u4);

        // 16. Java Stream API
        added += seed("jv-001", "Java Stream API Patterns", "java",
            "import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class StreamPatterns {\n    // Group by category and sum\n    public Map<String, Double> totalByCategory(List<Order> orders) {\n        return orders.stream()\n            .collect(Collectors.groupingBy(\n                Order::getCategory,\n                Collectors.summingDouble(Order::getAmount)\n            ));\n    }\n\n    // Top N items\n    public List<Order> topN(List<Order> orders, int n) {\n        return orders.stream()\n            .sorted(Comparator.comparingDouble(Order::getAmount).reversed())\n            .limit(n)\n            .toList();\n    }\n\n    // Partition into two groups\n    public Map<Boolean, List<Order>> partition(List<Order> orders) {\n        return orders.stream()\n            .collect(Collectors.partitioningBy(o -> o.getAmount() > 100));\n    }\n}", u5);

        // 17. Java Builder Pattern
        added += seed("jv-002", "Builder Pattern Implementation", "java",
            "public class HttpRequest {\n    private final String url;\n    private final String method;\n    private final Map<String, String> headers;\n    private final String body;\n    private final int timeout;\n\n    private HttpRequest(Builder builder) {\n        this.url = builder.url;\n        this.method = builder.method;\n        this.headers = builder.headers;\n        this.body = builder.body;\n        this.timeout = builder.timeout;\n    }\n\n    public static class Builder {\n        private final String url;\n        private String method = \"GET\";\n        private Map<String, String> headers = new HashMap<>();\n        private String body;\n        private int timeout = 30000;\n\n        public Builder(String url) { this.url = url; }\n        public Builder method(String m) { this.method = m; return this; }\n        public Builder header(String k, String v) { headers.put(k, v); return this; }\n        public Builder body(String b) { this.body = b; return this; }\n        public Builder timeout(int t) { this.timeout = t; return this; }\n        public HttpRequest build() { return new HttpRequest(this); }\n    }\n}\n\n// Usage:\nvar req = new HttpRequest.Builder(\"https://api.example.com\")\n    .method(\"POST\")\n    .header(\"Authorization\", \"Bearer token\")\n    .body(\"{\\\"name\\\": \\\"test\\\"}\")\n    .timeout(5000)\n    .build();", u5);

        // 18. Java Spring REST
        added += seed("jv-003", "Spring Boot REST Controller", "java",
            "import org.springframework.web.bind.annotation.*;\nimport org.springframework.http.ResponseEntity;\nimport java.util.List;\n\n@RestController\n@RequestMapping(\"/api/products\")\npublic class ProductController {\n\n    private final ProductService service;\n\n    public ProductController(ProductService service) {\n        this.service = service;\n    }\n\n    @GetMapping\n    public List<Product> getAll(\n            @RequestParam(defaultValue = \"0\") int page,\n            @RequestParam(defaultValue = \"10\") int size) {\n        return service.findAll(page, size);\n    }\n\n    @GetMapping(\"/{id}\")\n    public ResponseEntity<Product> getById(@PathVariable Long id) {\n        return service.findById(id)\n            .map(ResponseEntity::ok)\n            .orElse(ResponseEntity.notFound().build());\n    }\n\n    @PostMapping\n    public ResponseEntity<Product> create(@RequestBody Product product) {\n        return ResponseEntity.status(201).body(service.save(product));\n    }\n\n    @DeleteMapping(\"/{id}\")\n    public ResponseEntity<Void> delete(@PathVariable Long id) {\n        service.deleteById(id);\n        return ResponseEntity.noContent().build();\n    }\n}", u5);

        // 19. Go Worker Pool
        added += seed("go-001", "Go Concurrent Worker Pool", "go",
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\nfunc worker(id int, jobs <-chan int, results chan<- int) {\n\tfor j := range jobs {\n\t\tfmt.Printf(\"Worker %d processing job %d\\n\", id, j)\n\t\tresults <- j * 2\n\t}\n}\n\nfunc main() {\n\tconst numJobs = 10\n\tjobs := make(chan int, numJobs)\n\tresults := make(chan int, numJobs)\n\n\tvar wg sync.WaitGroup\n\tfor w := 1; w <= 3; w++ {\n\t\twg.Add(1)\n\t\tgo func(id int) {\n\t\t\tdefer wg.Done()\n\t\t\tworker(id, jobs, results)\n\t\t}(w)\n\t}\n\n\tfor j := 1; j <= numJobs; j++ {\n\t\tjobs <- j\n\t}\n\tclose(jobs)\n\n\tgo func() {\n\t\twg.Wait()\n\t\tclose(results)\n\t}()\n\n\tfor r := range results {\n\t\tfmt.Println(\"Result:\", r)\n\t}\n}", u6);

        // 20. Go HTTP Server
        added += seed("go-002", "Go HTTP Server with Middleware", "go",
            "package main\n\nimport (\n\t\"log\"\n\t\"net/http\"\n\t\"time\"\n)\n\n// Logging middleware\nfunc logging(next http.Handler) http.Handler {\n\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\tstart := time.Now()\n\t\tnext.ServeHTTP(w, r)\n\t\tlog.Printf(\"%s %s %v\", r.Method, r.URL.Path, time.Since(start))\n\t})\n}\n\n// CORS middleware\nfunc cors(next http.Handler) http.Handler {\n\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\tw.Header().Set(\"Access-Control-Allow-Origin\", \"*\")\n\t\tw.Header().Set(\"Access-Control-Allow-Methods\", \"GET,POST,PUT,DELETE\")\n\t\tif r.Method == \"OPTIONS\" {\n\t\t\tw.WriteHeader(200)\n\t\t\treturn\n\t\t}\n\t\tnext.ServeHTTP(w, r)\n\t})\n}\n\nfunc main() {\n\tmux := http.NewServeMux()\n\tmux.HandleFunc(\"/api/hello\", func(w http.ResponseWriter, r *http.Request) {\n\t\tw.Write([]byte(`{\"message\": \"Hello, World!\"}`))\n\t})\n\n\thandler := logging(cors(mux))\n\tlog.Fatal(http.ListenAndServe(\":8080\", handler))\n}", u6);

        // 21. Rust Error Handling
        added += seed("rs-001", "Rust Error Handling Patterns", "rust",
            "use std::fs::File;\nuse std::io::{self, Read};\nuse std::path::Path;\n\n// Using ? operator for clean error propagation\nfn read_file<P: AsRef<Path>>(path: P) -> Result<String, io::Error> {\n    let mut content = String::new();\n    File::open(path)?.read_to_string(&mut content)?;\n    Ok(content.trim().to_string())\n}\n\n// Custom error type\n#[derive(Debug)]\nenum AppError {\n    Io(io::Error),\n    Parse(std::num::ParseIntError),\n    Custom(String),\n}\n\nimpl From<io::Error> for AppError {\n    fn from(e: io::Error) -> Self { AppError::Io(e) }\n}\n\nimpl From<std::num::ParseIntError> for AppError {\n    fn from(e: std::num::ParseIntError) -> Self { AppError::Parse(e) }\n}\n\nfn process_file(path: &str) -> Result<i32, AppError> {\n    let content = read_file(path)?;\n    let number: i32 = content.parse()?;\n    Ok(number * 2)\n}", u6);

        // 22. SQL Queries
        added += seed("sq-001", "PostgreSQL Common Queries", "sql",
            "-- Upsert (insert or update)\nINSERT INTO users (id, name, email, updated_at)\nVALUES (1, 'Alice', 'alice@example.com', NOW())\nON CONFLICT (id)\nDO UPDATE SET\n    name = EXCLUDED.name,\n    email = EXCLUDED.email,\n    updated_at = NOW();\n\n-- Window functions - rank by category\nSELECT name, category, price,\n    RANK() OVER (PARTITION BY category ORDER BY price DESC) as price_rank\nFROM products;\n\n-- Recursive CTE - org hierarchy\nWITH RECURSIVE org_tree AS (\n    SELECT id, name, manager_id, 1 AS depth\n    FROM employees WHERE manager_id IS NULL\n    UNION ALL\n    SELECT e.id, e.name, e.manager_id, t.depth + 1\n    FROM employees e\n    JOIN org_tree t ON e.manager_id = t.id\n)\nSELECT * FROM org_tree ORDER BY depth;", u6);

        // 23. CSS Modern Layouts
        added += seed("cs-001", "CSS Modern Layout Patterns", "css",
            "/* Responsive grid - auto-fit */\n.auto-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n}\n\n/* Holy grail layout */\n.layout {\n  display: grid;\n  grid-template: \"header header\" auto\n                 \"sidebar main\" 1fr\n                 \"footer footer\" auto\n                 / 250px 1fr;\n  min-height: 100vh;\n}\n\n/* Center anything */\n.center {\n  display: grid;\n  place-items: center;\n}\n\n/* Sticky footer */\n.page {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n}\n.page main { flex: 1; }\n\n/* Glassmorphism card */\n.glass {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(16px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 16px;\n}", u1);

        // 24. CSS Animations
        added += seed("cs-002", "CSS Animation Collection", "css",
            "/* Smooth fade in up */\n@keyframes fadeInUp {\n  from { opacity: 0; transform: translateY(20px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n.fade-in-up { animation: fadeInUp 0.5s ease-out; }\n\n/* Pulse glow effect */\n@keyframes pulse-glow {\n  0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.3); }\n  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.6); }\n}\n.glow { animation: pulse-glow 2s ease-in-out infinite; }\n\n/* Skeleton loading */\n@keyframes shimmer {\n  0% { background-position: -200% 0; }\n  100% { background-position: 200% 0; }\n}\n.skeleton {\n  background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);\n  background-size: 200% 100%;\n  animation: shimmer 1.5s ease-in-out infinite;\n}\n\n/* Spin */\n.spin { animation: spin 1s linear infinite; }\n@keyframes spin { to { transform: rotate(360deg); } }", u1);

        // 25. Bash Scripts
        added += seed("sh-001", "Bash Backup & Utility Scripts", "bash",
            "#!/bin/bash\n\n# Directory backup with timestamp\nbackup() {\n  local dir=\"$1\"\n  local timestamp=$(date +\"%Y%m%d_%H%M%S\")\n  local filename=\"backup_$(basename $dir)_$timestamp.tar.gz\"\n\n  tar -czf \"$filename\" \"$dir\" && \\\n    echo \"Backup created: $filename\" || \\\n    echo \"Backup failed!\"\n}\n\n# Find and replace in files\nfind_replace() {\n  grep -rl \"$1\" . --include=\"*.${3:-*}\" | \\\n    xargs sed -i \"s/$1/$2/g\"\n  echo \"Replaced '$1' with '$2'\"\n}\n\n# Kill process on port\nkill_port() {\n  local pid=$(lsof -ti :$1)\n  if [ -n \"$pid\" ]; then\n    kill -9 $pid\n    echo \"Killed process $pid on port $1\"\n  else\n    echo \"No process on port $1\"\n  fi\n}\n\n# Quick HTTP server\nserve() {\n  python3 -m http.server ${1:-8000}\n}", u6);

        // 26. Docker Compose
        added += seed("dk-001", "Docker Compose Full Stack", "yaml",
            "version: '3.8'\n\nservices:\n  app:\n    build: .\n    ports:\n      - '3000:3000'\n    environment:\n      DATABASE_URL: postgres://user:pass@db:5432/mydb\n      REDIS_URL: redis://cache:6379\n    depends_on:\n      db:\n        condition: service_healthy\n      cache:\n        condition: service_started\n    volumes:\n      - .:/app\n      - /app/node_modules\n\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n      POSTGRES_DB: mydb\n    ports:\n      - '5432:5432'\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    healthcheck:\n      test: ['CMD-SHELL', 'pg_isready -U user -d mydb']\n      interval: 5s\n      retries: 5\n\n  cache:\n    image: redis:7-alpine\n    ports:\n      - '6379:6379'\n\nvolumes:\n  pgdata:", u6);

        // 27. HTML5 Boilerplate
        added += seed("ht-001", "HTML5 Responsive Boilerplate", "html",
            "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Page description for SEO\">\n    <title>My App</title>\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\">\n    <style>\n        *, *::before, *::after { box-sizing: border-box; margin: 0; }\n        body {\n            font-family: 'Inter', sans-serif;\n            line-height: 1.6;\n            color: #1a1a2e;\n            min-height: 100vh;\n        }\n        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }\n        @media (max-width: 768px) {\n            .container { padding: 0 0.75rem; }\n        }\n    </style>\n</head>\n<body>\n    <header class=\"container\">\n        <nav><!-- Navigation --></nav>\n    </header>\n    <main class=\"container\">\n        <h1>Welcome</h1>\n    </main>\n    <footer class=\"container\">\n        <p>&copy; 2026 My App</p>\n    </footer>\n</body>\n</html>", u1);

        // 28. JSON Config
        added += seed("jn-001", "Package.json Project Setup", "json",
            "{\n  \"name\": \"my-fullstack-app\",\n  \"version\": \"1.0.0\",\n  \"private\": true,\n  \"scripts\": {\n    \"dev\": \"next dev\",\n    \"build\": \"next build\",\n    \"start\": \"next start\",\n    \"lint\": \"next lint\",\n    \"test\": \"vitest\",\n    \"test:watch\": \"vitest --watch\",\n    \"db:push\": \"prisma db push\",\n    \"db:studio\": \"prisma studio\",\n    \"format\": \"prettier --write .\"\n  },\n  \"dependencies\": {\n    \"next\": \"^14.0.0\",\n    \"react\": \"^18.2.0\",\n    \"react-dom\": \"^18.2.0\",\n    \"@prisma/client\": \"^5.0.0\",\n    \"zod\": \"^3.22.0\",\n    \"lucide-react\": \"^0.300.0\"\n  },\n  \"devDependencies\": {\n    \"typescript\": \"^5.3.0\",\n    \"@types/react\": \"^18.2.0\",\n    \"prettier\": \"^3.1.0\",\n    \"vitest\": \"^1.0.0\"\n  }\n}", u2);

        // 29. Regex Patterns
        added += seed("js-006", "Regex Patterns Collection", "javascript",
            "// Email validation\nconst isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;\n\n// URL validation\nconst isURL = /^(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z]{2,6}\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;\n\n// Password strength (min 8, upper, lower, number, special)\nconst strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/;\n\n// Extract numbers from string\nconst numbers = 'abc123def456'.match(/\\d+/g); // ['123', '456']\n\n// Replace multiple spaces with single\nconst clean = 'hello   world'.replace(/\\s+/g, ' ');\n\n// Named capture groups\nconst dateRegex = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;\nconst { groups } = '2026-03-30'.match(dateRegex);\n// groups.year = '2026', groups.month = '03', groups.day = '30'\n\n// Remove HTML tags\nconst stripHTML = html => html.replace(/<[^>]*>/g, '');", u2);

        // 30. Git Commands
        added += seed("sh-002", "Essential Git Commands", "bash",
            "# Undo last commit (keep changes staged)\ngit reset --soft HEAD~1\n\n# Undo last commit (unstage changes)\ngit reset --mixed HEAD~1\n\n# Amend last commit message\ngit commit --amend -m \"New message\"\n\n# Add forgotten file to last commit\ngit add forgotten_file.js\ngit commit --amend --no-edit\n\n# Interactive rebase (squash, edit, reorder)\ngit rebase -i HEAD~5\n\n# Stash with message\ngit stash push -m \"WIP: feature login\"\ngit stash list\ngit stash pop stash@{0}\n\n# Cherry-pick a commit\ngit cherry-pick abc123f\n\n# Find which commit broke something\ngit bisect start\ngit bisect bad          # current is broken\ngit bisect good v1.0    # v1.0 was working\n# Git will binary search for the bad commit\n\n# Clean up merged branches\ngit branch --merged | grep -v 'main' | xargs git branch -d", u6);

        log.info("Seeding complete. Added {} new permanent snippets.", added);
    }

    // ── Helpers ──────────────────────────────────────────

    private User getOrCreateUser(String username, String email) {
        return userRepository.findByUsername(username)
                .orElseGet(() -> {
                    log.info("Creating seed user: {}", username);
                    return userRepository.save(User.builder()
                            .username(username)
                            .email(email)
                            .password(passwordEncoder.encode("password123"))
                            .build());
                });
    }

    private int seed(String shortUrl, String title, String language, String content, User user) {
        if (snippetRepository.existsByShortUrl(shortUrl)) {
            return 0; // Already exists, skip
        }
        snippetRepository.save(Snippet.builder()
                .title(title)
                .content(content)
                .language(language)
                .visibility(Snippet.Visibility.PUBLIC)
                .shortUrl(shortUrl)
                .permanent(true)
                .user(user)
                .build());
        return 1;
    }
}
