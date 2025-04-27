export type tableManipulationTypeType = {
  createdAt: string;
  updatedAt: string;
};

export type testType = {
  name: string;
  age: number;
  isActive: boolean;
  hobbies: string[];
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  phoneNumber?: string;
  email?: string;
  roles: string[];
  metadata?: Record<string, any>;
};
