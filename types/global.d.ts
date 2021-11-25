export {};

declare global {
  interface Window {
    DOMAIN: string;
  }

  const DOMAIN: string;

  const HT_ATTENDANCE_MOCK_DATA: {
    AttendanceDateTime: string;
    NAME: string;
    userNo: string;
  }[];

  const bootstrap: any;

  interface Document {
    webkitHidden: boolean;
  }
}

export namespace JSX {
  interface HTMLAttributes<T> {
    key?: string;
  }
}
