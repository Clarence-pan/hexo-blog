title: 一个简单HTTP服务器
date: 2015-08-05
---

简单到只有200 OK和Hello world....

```
import BaseHTTPServer

class Handler(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200, "OK")
        self.end_headers()
        self.wfile.write("Hello world!")


srv = BaseHTTPServer.HTTPServer(('', 8090), Handler)

srv.serve_forever()
```
