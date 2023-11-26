// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

// import { ExcelServiceRoutingModule } from './excel-service-routing.module';


// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule,
//     ExcelServiceRoutingModule
//   ]
// })
// export class ExcelServiceModule { }


import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export interface TitleConfig {
  spaces: number;
  titleName?: string;
  font?: Font;
  alignment?: Alignment;
  mergeCellAddress?: string;
  startDate?: Date;
  endDate?: Date;
  note?: Note;
}
export interface ViewConfig {
  frozen?: View;
  split?: View;
  autoFilter?: AutoFilter;
}
export interface AutoFilter {
  from: {
    row: number,
    column: number
  };
  to: {
    row: number,
    column: number
  };
}
export interface View {
  xSplit: number; 
  ySplit: number;
  topLeftCell: string;
  activeCell: string;
}
export interface Note {
  cell_address: string;
  note: string;
}
export interface Alignment {
  vertical: string;
  horizontal: string;
}
export interface Font {
  name?: string;
  family?: number;
  size?: number;
  bold?: boolean;
}
export interface ExcelConfig {
  spaces: number;
  colors?: ExcelColor;
  border?: ExcelBorder;
  alignment?: Boolean;
  color_header?: Boolean;
}
export interface ExcelBorder {
  top: string;
  left: string;
  bottom: string;
  right: string;
}
export interface ExcelColor {
  fgColor: string;
  bgColor: string;
  fontColor: string;
}
export interface Level {
  key: string;
  label: string;
  alignment?: Alignment;
  colors?: ExcelColor;
}

export interface ColumnWidth {
  columnNumber: number;
  width: number;
}

@Injectable()
// @Injectable({
//   providedIn: 'root'
// })
export class ExcelService {

  constructor(
    public datepipe: DatePipe,
  ) { }

  //#region xlsx

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const myworkbook: XLSX.WorkBook = { Sheets: { 'data': myworksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  //#endregion

  //#region exceljs

  makeTitle(worksheet: any, config: TitleConfig) {
    // mergeCellAddress = 'A1:D2'
    const titleRow = worksheet.addRow([...this.makeSpaces(config.spaces), config.titleName]);
    titleRow.font = {
      name: config.font?.name || 'Cambria',
      family: config.font?.family || 4,
      size: config.font?.size || 16,
      bold: config.font?.bold || false
    };

    config.alignment = config.alignment || { vertical:'middle', horizontal: 'left' };
    titleRow.alignment = { horizontal: config.alignment.horizontal };

    worksheet.addRow([
      ...this.makeSpaces(config.spaces),
      'Start Date : ', this.datepipe.transform(config.startDate, 'mediumDate'),
      'End Date : ', this.datepipe.transform(config.endDate, 'mediumDate'),
      ...this.makeSpaces(config.spaces), config.note?.note,
    ]);

    worksheet.addRow([]);

    if (config.mergeCellAddress) worksheet.mergeCells(config.mergeCellAddress);

    if(config.note) worksheet.mergeCells(config.note.cell_address);

    return worksheet;
  }

  worksheetView(worksheet: any, config: ViewConfig){
    if(config.frozen) {
      worksheet.views = [{
        state: 'frozen', 
        xSplit: config.frozen?.xSplit, 
        ySplit: config.frozen?.ySplit,
        topLeftCell: config.frozen?.topLeftCell,
        activeCell: config.frozen?.activeCell,
      }];
    }

    if(config.split) {
      worksheet.views = [{
        state: 'split', 
        xSplit: config.frozen?.xSplit, 
        ySplit: config.frozen?.ySplit,
        topLeftCell: config.frozen?.topLeftCell,
        activeCell: config.frozen?.activeCell,
      }];
    }
    
    if(config.autoFilter) worksheet.autoFilter = config.autoFilter;
    
    return worksheet;
  }

  columnWidth(worksheet: any, columnWidth: Array<ColumnWidth>) {
    columnWidth.forEach(item => {
      worksheet.getColumn(item.columnNumber).width = item.width;
    });

    return worksheet;
  }

  makeWorkSheet(workSheetname: string) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(`${workSheetname}`);
    return { workbook, worksheet };
  }

  getNewWorkBook(){
    return new Workbook();
  }

  getNewWorkSheet(workbook: any, sheetName: string){
    return workbook.addWorksheet(`${sheetName}`);
  }

  makeSpaces(space: number) {
    let spaces = [];

    for (let i = 0; i < space; i++) {
      spaces.push('');
    }
    return spaces;
  }

  makeHeader(worksheet: any, columns: Array<Level>, config: ExcelConfig) {
    const headerRow = worksheet.addRow([
      ...this.makeSpaces(config.spaces),
      ...(columns || []).map(x => x.label)
    ]);

    if (config.colors) {
      headerRow.eachCell((cell: any, number: any) => {
        if (number > config.spaces) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: config.colors?.fgColor },
            bgColor: { argb: config.colors?.bgColor }
          };
          cell.font = {
            color: { argb: config.colors?.fontColor || 'FFFFFF' },
            bold: true
          };
        }
      });
    }

    if (config.border) {
      headerRow.border = {
        top: { style: config.border?.top },
        left: { style: config.border?.left },
        bottom: { style: config.border?.bottom },
        right: { style: config.border?.right }
      };
    }

    if (config.alignment) {
      headerRow.eachCell((cell: any, number: any) => {
        if (number > config.spaces) {
          cell.alignment = columns[number - 1].alignment;
        }        
      });
    }

    if(config.color_header){
      headerRow.eachCell((cell: any, number: any) => {
        if (number > config.spaces) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: columns[number - 1].colors?.fgColor },
            bgColor: { argb: columns[number - 1].colors?.bgColor }
          };
          cell.font = {
            color: { argb: columns[number - 1].colors?.fontColor || 'FFFFFF' },
            bold: true
          };
        }
      });
    }

    return worksheet;
  } 

  makeData(worksheet: any, config: ExcelConfig, columns: Array<Level>, data: any) {
    let columnData: any = [];

    (columns || []).map(x => { 
      columnData.push(data[x.key]);
    });

    const dataRow = worksheet.addRow([...this.makeSpaces(config.spaces), ...columnData]);   

    if (config.alignment) {
      dataRow.eachCell((cell: any, number: any) => {
        cell.alignment = columns[number - 1].alignment;
      });
    }

    if (config.border) {
      dataRow.border = {
        top: { style: config.border?.top },
        left: { style: config.border?.left },
        bottom: { style: config.border?.bottom },
        right: { style: config.border?.right }
      };
    }

    if (config.colors) {
      dataRow.eachCell((cell: any) => {
        if (cell.value < 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: config.colors?.fgColor },
            bgColor: { argb: config.colors?.bgColor }
          };
          cell.font = {
            color: { argb: config.colors?.fontColor || 'FFFFFF' },
            bold: true
          };
        }
      });
    }

    return worksheet;
  }

  downoadExcel(workbook: any, filename: string) {
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      FileSaver.saveAs(blob, `${filename}.xlsx`);
    });
  }

  //#endregion
}

