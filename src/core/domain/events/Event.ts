export interface EventProps {
    id: string;
    title: string;
    description: string;
    date: Date;
    venue: string;
    capacity: number;
    price: number;
    organizerId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export class Event {
    private props: EventProps;
  
    constructor(props: EventProps) {
      this.props = props;
    }
  
    get id(): string {
      return this.props.id;
    }
  
    get title(): string {
      return this.props.title;
    }
  
  
    public update(props: Partial<EventProps>): void {
      Object.assign(this.props, props);
      this.props.updatedAt = new Date();
    }
  
    public toJSON(): EventProps {
      return { ...this.props };
    }
  }
  