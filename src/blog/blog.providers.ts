import { Connection } from 'mongoose';
import { BlogSchema } from './schemas/blog.schema';

export const blogProviders = [
  {
    provide: 'BLOG_MODEL',
    useFactory: (connection: Connection) => connection.model('Blog', BlogSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];