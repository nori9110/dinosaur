import requests
from bs4 import BeautifulSoup
import os
import time
import json
import re

def create_docs_directory():
    if not os.path.exists('docs'):
        os.makedirs('docs')
    if not os.path.exists('docs/images'):
        os.makedirs('docs/images')

def download_image(image_url, rank, name):
    try:
        response = requests.get(image_url)
        if response.status_code == 200:
            file_extension = image_url.split('.')[-1]
            filename = f"{rank:02d}_{name}.{file_extension}"
            filepath = os.path.join('docs/images', filename)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            return filename
    except Exception as e:
        print(f"画像のダウンロードに失敗しました: {name} - {str(e)}")
    return None

def scrape_dinosaur_ranking():
    url = 'https://kyouryu.info/popularity_ranking2018.php'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.text, 'html.parser')
        
        dinosaurs = []
        rank_pattern = re.compile(r'(\d+)位\s+(.+)')
        
        # 恐竜の情報を取得
        content = soup.get_text()
        lines = content.split('\n')
        current_rank = None
        current_name = None
        
        for line in lines:
            rank_match = rank_pattern.search(line)
            if rank_match:
                current_rank = int(rank_match.group(1))
                current_name = rank_match.group(2).strip()
                dinosaurs.append({
                    'rank': current_rank,
                    'name': current_name,
                    'image_url': None,
                    'image_filename': None
                })
                print(f"Found dinosaur: Rank {current_rank} - {current_name}")

        # 画像を取得
        images = soup.find_all('img')
        for img in images:
            if 'src' in img.attrs and 'の画像' in str(img):
                image_url = img['src']
                if not image_url.startswith('http'):
                    image_url = f"https://kyouryu.info/{image_url}"
                
                # 画像の名前から恐竜を特定
                img_text = str(img)
                for dino in dinosaurs:
                    if dino['name'] in img_text:
                        # 画像をダウンロード（適切な間隔を空ける）
                        time.sleep(1)
                        filename = download_image(image_url, dino['rank'], dino['name'])
                        if filename:
                            dino['image_url'] = image_url
                            dino['image_filename'] = filename
                            print(f"Downloaded image for: {dino['name']}")
                        break

        # 結果をJSONファイルに保存
        with open('docs/data.json', 'w', encoding='utf-8') as f:
            json.dump({'dinosaurs': dinosaurs}, f, ensure_ascii=False, indent=2)
        
        print("スクレイピングが完了しました。")
        return dinosaurs
        
    except Exception as e:
        print(f"エラーが発生しました: {str(e)}")
        return []

if __name__ == "__main__":
    create_docs_directory()
    dinosaurs = scrape_dinosaur_ranking() 