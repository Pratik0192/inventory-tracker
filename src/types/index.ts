
export type User = {
  id: number;
  name: string;
  uniqueId: string;
  phoneNo: string;
  email: string;
  role: string;
};

export type Process = {
  id: number;
  name: string;
  shortForm: string;
  targetDays: number;
  concernedDept: User[];
};

export type Vendor = {
  id: number;
  name: string;
  phoneNo: string;
  email: string | null;
  address: string | null;
  uniqueId: string;
  role: string;
  status: string;
  typeOfWork: string | null;
};
