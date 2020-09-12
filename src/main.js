import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'Atreya',
		age: '30'
		//instantiating name
	}
});

export default app;