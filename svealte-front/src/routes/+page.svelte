<script>
	import { onMount } from 'svelte';
	import TaskCard from '$lib/components/TaskCard.svelte';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import TaskFilters from '$lib/components/TaskFilters.svelte';
	import { getTasks, createTask, updateTask, deleteTask } from '$lib/api.js';

	let tasks = $state([]);
	let loading = $state(true);
	let error = $state(null);
	let showForm = $state(false);
	let editingTask = $state(null);
	let filters = $state({
		search: '',
		priority: '',
		dateFrom: '',
		dateTo: ''
	});

	// Cargar tareas al montar el componente
	onMount(() => {
		loadTasks();
	});

	async function loadTasks() {
		loading = true;
		error = null;
		try {
			// Preparar filtros para la API
			const apiFilters = {};
			if (filters.search) apiFilters.search = filters.search;
			if (filters.priority) apiFilters.priority = filters.priority;
			if (filters.dateFrom) apiFilters.dateFrom = new Date(filters.dateFrom).toISOString();
			if (filters.dateTo) {
				// Agregar 23:59:59 a la fecha final
				const endDate = new Date(filters.dateTo);
				endDate.setHours(23, 59, 59, 999);
				apiFilters.dateTo = endDate.toISOString();
			}

			tasks = await getTasks(apiFilters);
		} catch (err) {
			error = err.message;
			console.error('Error al cargar tareas:', err);
		} finally {
			loading = false;
		}
	}

	async function handleCreateTask(taskData) {
		try {
			await createTask(taskData);
			await loadTasks();
		} catch (err) {
			throw err;
		}
	}

	async function handleUpdateTask(taskData) {
		try {
			if (editingTask) {
				await updateTask(editingTask.id, taskData);
				editingTask = null;
				await loadTasks();
			}
		} catch (err) {
			throw err;
		}
	}

	async function handleToggleComplete(taskId, completed) {
		try {
			await updateTask(taskId, { completed });
			await loadTasks();
		} catch (err) {
			alert(`Error al actualizar tarea: ${err.message}`);
		}
	}

	async function handleDeleteTask(taskId) {
		try {
			await deleteTask(taskId);
			await loadTasks();
		} catch (err) {
			alert(`Error al eliminar tarea: ${err.message}`);
		}
	}

	function handleEditTask(task) {
		editingTask = task;
		showForm = true;
	}

	function handleNewTask() {
		editingTask = null;
		showForm = true;
	}

	async function handleApplyFilters() {
		await loadTasks();
	}

	async function handleClearFilters() {
		await loadTasks();
	}

	// Estadísticas
	const totalTasks = $derived(tasks.length);
	const completedTasks = $derived(tasks.filter((t) => t.completed).length);
	const pendingTasks = $derived(tasks.filter((t) => !t.completed).length);
	const overdueTasks = $derived(
		tasks.filter((t) => !t.completed && new Date(t.deadline) < new Date()).length
	);
</script>

<div class="min-h-screen bg-black">
	<div class="mx-auto max-w-7xl px-4 py-8">
		<!-- Header -->
		<header class="mb-8">
			<div class="mb-6 flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 class="text-4xl font-bold text-white">Gestor de Tareas</h1>
					<p class="mt-2 text-gray-400">Organiza y gestiona tus tareas de manera eficiente</p>
				</div>
				<button
					onclick={handleNewTask}
					class="flex items-center gap-2 rounded-lg border border-gray-800 bg-white px-6 py-3 font-semibold text-black shadow-lg transition hover:bg-gray-100"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Nueva Tarea
				</button>
			</div>

			<!-- Estadísticas -->
			<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
				<div class="rounded-lg border border-gray-800 bg-gray-950 p-4">
					<p class="text-sm text-gray-400">Total</p>
					<p class="text-2xl font-bold text-white">{totalTasks}</p>
				</div>
				<div class="rounded-lg border border-green-900 bg-green-950 p-4">
					<p class="text-sm text-green-400">Completadas</p>
					<p class="text-2xl font-bold text-green-300">{completedTasks}</p>
				</div>
				<div class="rounded-lg border border-yellow-900 bg-yellow-950 p-4">
					<p class="text-sm text-yellow-400">Pendientes</p>
					<p class="text-2xl font-bold text-yellow-300">{pendingTasks}</p>
				</div>
				<div class="rounded-lg border border-red-900 bg-red-950 p-4">
					<p class="text-sm text-red-400">Atrasadas</p>
					<p class="text-2xl font-bold text-red-300">{overdueTasks}</p>
				</div>
			</div>
		</header>

		<!-- Filtros -->
		<TaskFilters
			bind:filters
			onApplyFilters={handleApplyFilters}
			onClearFilters={handleClearFilters}
		/>

		<!-- Lista de tareas -->
		<main>
			{#if loading}
				<div class="flex items-center justify-center py-20">
					<div class="text-center">
						<div
							class="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"
						></div>
						<p class="text-gray-400">Cargando tareas...</p>
					</div>
				</div>
			{:else if error}
				<div class="rounded-lg border border-red-900 bg-red-950 p-6 text-center">
					<svg
						class="mx-auto mb-3 h-12 w-12 text-red-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p class="mb-4 text-lg font-semibold text-red-300">Error al cargar las tareas</p>
					<p class="mb-4 text-red-400">{error}</p>
					<button
						onclick={loadTasks}
						class="rounded-lg border border-gray-800 bg-white px-6 py-2 font-medium text-black transition hover:bg-gray-100"
					>
						Reintentar
					</button>
				</div>
			{:else if tasks.length === 0}
				<div class="rounded-lg border-2 border-dashed border-gray-800 bg-gray-950 p-12 text-center">r">
					<svg
						class="mx-auto mb-4 h-16 w-16 text-gray-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<p class="mb-2 text-xl font-semibold text-white">No hay tareas</p>
					<p class="mb-6 text-gray-400">
						{filters.search || filters.priority || filters.dateFrom || filters.dateTo
							? 'No se encontraron tareas con los filtros aplicados'
							: 'Comienza creando tu primera tarea'}
					</p>
					<button
						onclick={handleNewTask}
						class="rounded-lg border border-gray-800 bg-white px-6 py-2 font-medium text-black transition hover:bg-gray-100"
					>
						Crear Tarea
					</button>
				</div>
			{:else}
				<div class="space-y-4">
					{#each tasks as task (task.id)}
						<TaskCard
							{task}
							onToggleComplete={handleToggleComplete}
							onDelete={handleDeleteTask}
							onEdit={handleEditTask}
						/>
					{/each}
				</div>
			{/if}
		</main>
	</div>
</div>

<!-- Modal de formulario -->
<TaskForm
	bind:isOpen={showForm}
	onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
	{editingTask}
/>

