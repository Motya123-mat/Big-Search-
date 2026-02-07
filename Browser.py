#!/usr/bin/env python3
"""
Простой HTTP сервер для Big Search
"""

import http.server
import socketserver
import os
import sys

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

def main():
    # Меняем директорию на текущую
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"\n{'='*50}")
            print(f"Big Search Server запущен!")
            print(f"{'='*50}")
            print(f"📡 Адрес: http://localhost:{PORT}")
            print(f"📁 Папка: {os.getcwd()}")
            print(f"\n🛑 Нажмите Ctrl+C для остановки")
            print(f"{'='*50}\n")
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n👋 Сервер остановлен")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Ошибка: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            PORT = int(sys.argv[1])
        except:
            pass
    
    main()