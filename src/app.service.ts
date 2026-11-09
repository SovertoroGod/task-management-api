import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World from Task Management Api';
  }

  getAppInfo() {
    return {
      "name": "Task Management Api",
      "version": "1.0.0",
      "status": "Running"
    }
  }

  getHealth() {
    return {
      "status": "OK",
      "database": "Not connected",
      "environment": "development"
    }
  }
}
