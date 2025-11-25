<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Gestor de Tareas</title>
	<meta name="description" content="Aplicación de gestión de tareas con Svelte" />
</svelte:head>

{@render children()}
