import os
import re

def walk_and_replace(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original = content
                content = re.sub(r'from "(\.\.\/\.\.\/services)\/(admin[a-zA-Z0-9_]+)', r'from "\1/admin/\2', content)
                content = re.sub(r"from '(\.\.\/\.\.\/services)\/(admin[a-zA-Z0-9_]+)", r"from '\1/admin/\2", content)
                content = re.sub(r'from "(\.\.\/\.\.\/\.\.\/services)\/(admin[a-zA-Z0-9_]+)', r'from "\1/admin/\2', content)
                content = re.sub(r"from '(\.\.\/\.\.\/\.\.\/services)\/(admin[a-zA-Z0-9_]+)", r"from '\1/admin/\2", content)
                
                if content != original:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {file_path}")

walk_and_replace('./src')
