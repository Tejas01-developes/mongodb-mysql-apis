import bull from 'bull';

export const taskqueue=new bull(
    "tasks",
    "redis://127.0.0.1:6379"
)