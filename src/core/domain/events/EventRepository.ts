import { Event } from './Event';

export interface EventRepository {
  findById(id: string): Promise<Event | null>;
  findAll(): Promise<Event[]>;
  create(event: Event): Promise<Event>;
  update(event: Event): Promise<Event>;
  delete(id: string): Promise<void>;
}
