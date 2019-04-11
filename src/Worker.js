import fs from 'fs';
import path from 'path';
import moment from 'moment';

// 來源資料夾
const SourcePath = './src/data';

class Worker {
  constructor(stage, fileName, min = 5) {
    // stage 資料夾名稱
    this.stage = stage;
    // 檔案名稱
    this.fileName = fileName;
    // 切割單位時間
    this.min = min;
    // 來源檔案(讀取用)
    this.sourceFile = path.resolve(SourcePath, stage, 'ecg', fileName);
    // 輸出資料夾
    this.exportPath = path.resolve('./out', this.stage, 'ecg');
    // 內容
    this.content = '';
  }

  static SourcePath() {
    return SourcePath;
  }

  // 開始工作
  run() {
    this.read();
  }

  // 開始讀檔
  read() {
    // 讀取檔案
    const readStream = fs.createReadStream(this.sourceFile);

    readStream.setEncoding('utf8');

    readStream.on('data', chunk => {
      this.content += chunk;
    });

    readStream.on('end', () => {
      this.process();
      console.log(`${this.stage} - ${this.fileName}`);
    });
  }

  // 開始切割時間
  process() {
    let files = [];
    try { files = JSON.parse(this.content); }
    catch (e) { files = []; }

    // 前面資料不穩，選擇捨棄前 1000 筆
    files = files.slice(1000);
    // 起始時間索引值
    let startIndex = 0;
    // 結束時間索引值
    let endIndex = undefined;
    // 起頭時間
    let tStart = files[startIndex].time;
    // 儲存切割好的陣列
    const splitFiles = [];

    try {
      files.forEach((f, index) => {
        // 如果起始與結束資料相差五分鐘, 切割出來
        // 最後一組，如果不到五分鐘則會被捨棄
        if (moment(f.time).diff(tStart) >= 60000 * this.min) {
          // 儲存當前的結尾時間
          endIndex = index;
          splitFiles.push(files.slice(startIndex, endIndex));
          // 更新起頭索引
          startIndex = index + 1;
          // 更新起頭時間
          tStart = files[startIndex].time;
        }
      });

      splitFiles.forEach((sp, index) => {
        this.write(JSON.stringify(sp), index);
      });

    } catch (e) {
      console.log('error', e);
    }
  }

  /**
   * 寫檔案
   * @param {s} files 檔案內容
   * @param {*} index 切割第幾份檔案
   */
  write(files = '', index = 0) {
    // 如果沒有輸出資料夾就建立
    if (!fs.existsSync(path.resolve('./out', this.stage))) fs.mkdirSync(path.resolve('./out', this.stage));
    if (!fs.existsSync(this.exportPath)) fs.mkdirSync(this.exportPath);

    const exportFile = `${this.fileName.replace('.json', '')}-${index}.json`;
    // console.log('Writing file: ' + OUTPUT_FILE);
    const FILE = path.resolve(this.exportPath, exportFile);
    const writeStram = fs.createWriteStream(FILE);

    writeStram.write(files);
    writeStram.end();
  }

}

export default Worker;