import { app } from './app';

const port = process.env.PORT || 80;
app.listen(port, () => {
	console.log(`Server "main" started on ${port}`);
});
