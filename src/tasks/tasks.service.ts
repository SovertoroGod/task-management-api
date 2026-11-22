import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TasksService {
    private tasks = [
        {
            "id": 1,
            "title": "Learn NestJS",
            "completed": false
        },
        {
            "id": 3,
            "title": "Build REST API",
            "completed": true
        }
    ];

    findAll() {
        return this.tasks;
    }

    findById(id: number) {
        const task = this.tasks.find((t) => t.id === id);
        return task;
    }

    create(title: string) {
        const newTask = {
            id: this.tasks.length + 1,
            title,
            completed: false
        }

        this.tasks.push(newTask);

        return newTask;
    }

    update(id:number,title?: string, completed?: boolean) {
        const task = this.findById(id);
        if (title && title !== undefined) {
            task!.title = title;
        };

        if (completed !== undefined) {
            task!.completed = completed;
        }

        return task;
    }

    delete(id: number) {
        const taskId = this.tasks.findIndex((t) => t.id === id);

        if (taskId === -1) {
            throw new NotFoundException(`Task with ${id} not found`)
        }

        this.tasks.splice(taskId, 1);

        return {
            message: "Task deleted successfully"
        }
    }
}
