import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
    mongoose.connect('mongodb+srv://indusudheesh:3kOKS5rJhE09T0Uz@cluster0.amzv5.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'),
  },
];