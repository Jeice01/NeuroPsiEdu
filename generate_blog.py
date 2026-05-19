import json
import os
import re

# Map of files to images
file_mapping = {
    '01_Bem-Vindos_Por_Que_TDAH.docx': {'image': 'Texto 1.png', 'slug': 'bem-vindos-por-que-falar-sobre-tdah'},
    '02_O_TDAH_e_Real.docx': {'image': 'Texto 2.png', 'slug': 'o-tdah-e-real'},
    '03_TDAH_Para_Toda_a_Vida.docx': {'image': 'Texto 3.png', 'slug': 'tdah-para-toda-a-vida'},
    '04_TDAH_Apresentacao_Desatenta.docx': {'image': 'Texto 4.png', 'slug': 'tdah-apresentacao-desatenta'},
    '05_TDAH_Apresentacao_Hiperativa.docx': {'image': 'Texto 5.png', 'slug': 'tdah-apresentacao-hiperativa'},
    '06_Os_Tres_Tipos_de_TDAH.docx': {'image': 'Texto 6.png', 'slug': 'os-tres-tipos-de-tdah'}
}

folder = r'c:\Users\JeiceSantos\Desktop\NeuroPsiEdu\conteudo_blog'
with open(os.path.join(folder, 'extracted.json'), 'r', encoding='utf-8') as f:
    data = json.load(f)

posts = []
for file_name, content in data.items():
    if not content: continue
    
    paragraphs = content.split('\n\n')
    title = paragraphs[0]
    body = paragraphs[1:]
    
    info = file_mapping[file_name]
    
    # Generate summary
    summary = body[0][:150] + '...' if len(body[0]) > 150 else body[0]
    
    post = {
        'slug': info['slug'],
        'title': title,
        'summary': summary,
        'image': f'/images/blog/{info["image"]}',
        'content': body,
        'date': 'Maio 2026',
        'author': 'Jeice Santos'
    }
    posts.append(post)

# Sort posts (maybe by the numerical prefix in the filename)
posts.sort(key=lambda x: x['slug'])

# Write to TS file
ts_content = f"""export interface BlogPost {{
  slug: string;
  title: string;
  summary: string;
  image: string;
  content: string[];
  date: string;
  author: string;
}}

export const blogPosts: BlogPost[] = {json.dumps(posts, ensure_ascii=False, indent=2)};
"""

os.makedirs(r'c:\Users\JeiceSantos\Desktop\NeuroPsiEdu\src\data', exist_ok=True)
with open(r'c:\Users\JeiceSantos\Desktop\NeuroPsiEdu\src\data\blog.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

# Move images
os.makedirs(r'c:\Users\JeiceSantos\Desktop\NeuroPsiEdu\public\images\blog', exist_ok=True)
for info in file_mapping.values():
    img = info['image']
    src = os.path.join(folder, img)
    dst = os.path.join(r'c:\Users\JeiceSantos\Desktop\NeuroPsiEdu\public\images\blog', img)
    if os.path.exists(src):
        os.rename(src, dst)

print('Blog data generated and images moved.')
