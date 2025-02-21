import json
import os
from typing import List, Dict, Optional

class DinosaurData:
    def __init__(self, data_dir: str = 'docs'):
        self.data_dir = data_dir
        self.data_file = os.path.join(data_dir, 'data.json')
        self.images_dir = os.path.join(data_dir, 'images')
        self._data = self._load_data()

    def _load_data(self) -> Dict:
        """JSONファイルからデータを読み込む"""
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"データの読み込みに失敗しました: {str(e)}")
            return {'dinosaurs': []}

    def get_all_dinosaurs(self) -> List[Dict]:
        """全ての恐竜データを取得"""
        return self._data.get('dinosaurs', [])

    def get_dinosaur_by_rank(self, rank: int) -> Optional[Dict]:
        """ランクから恐竜データを取得"""
        for dino in self._data.get('dinosaurs', []):
            if dino['rank'] == rank:
                return dino
        return None

    def get_dinosaur_by_name(self, name: str) -> Optional[Dict]:
        """名前から恐竜データを取得"""
        for dino in self._data.get('dinosaurs', []):
            if dino['name'] == name:
                return dino
        return None

    def get_image_path(self, dino: Dict) -> Optional[str]:
        """恐竜の画像パスを取得"""
        if dino and dino.get('image_filename'):
            return os.path.join(self.images_dir, dino['image_filename'])
        return None

    def get_top_n_dinosaurs(self, n: int = 10) -> List[Dict]:
        """上位n位までの恐竜を取得"""
        return sorted(
            self._data.get('dinosaurs', []),
            key=lambda x: x['rank']
        )[:n]

if __name__ == "__main__":
    # 使用例
    dino_data = DinosaurData()
    
    # 全ての恐竜を取得
    all_dinos = dino_data.get_all_dinosaurs()
    print(f"登録されている恐竜の総数: {len(all_dinos)}")
    
    # 全ての恐竜を表示
    print("\n===== 全ての恐竜 =====")
    for dino in sorted(all_dinos, key=lambda x: x['rank']):
        print(f"{dino['rank']}位: {dino['name']}")
        image_path = dino_data.get_image_path(dino)
        if image_path:
            print(f"画像: {image_path}")
        print("---") 