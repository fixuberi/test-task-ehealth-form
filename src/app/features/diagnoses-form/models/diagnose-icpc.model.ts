export interface DiagnoseICPC {
  id: number;
  chapterNumber: string | null;
  chapterName: string;
  blockNumber: string;
  blockName: string;
  code: string;
  name: string;
  shortName: string;
  isPublic: boolean;
}
