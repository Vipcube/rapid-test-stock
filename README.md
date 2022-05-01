# 健保特約機構家用快篩庫存地圖

// todo

## 後端資料

- [對應資料](https://vipcube.github.io/opendata.gov.tw/rapidTestStock.json)
- [對應資料集 Github](https://github.com/Vipcube/opendata.gov.tw)

## Changelog

### 2022/04/30

- 因應當日半夜藥局資料爆量造成圖層讀取負荷很大，藥局圖層改為僅讀取 `BBox` 圖層，避免網站卡頓。
