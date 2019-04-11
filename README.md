# terminal-sensor-split

本專案是將透過 [terminal-sensor](https://github.com/explooosion/terminal-sensor) 所蒐集到的資料進行時間切割。

## 安裝

```sh
yarn # npm install
```

## 資料準備

請將 [terminal-sensor](https://github.com/explooosion/terminal-sensor) 產出的目錄 (`stage`) 放入於 `src/data`，可同時放入多個 `stage` 目錄。

參考 `.env.example` 檔案，建立名為 `.env` 的檔案。 `.env` 內容的 MIN 為欲切割的時間單位（分鐘）。

## 執行

```sh
yarn start # npm start
```

## 輸出

切割後的資料位於 `out` 底下，
