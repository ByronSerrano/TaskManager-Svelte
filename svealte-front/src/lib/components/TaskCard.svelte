<script>
	import { getImageUrl } from '$lib/api.js';
	import {
		formatDate,
		isOverdue,
		getDaysRemainingText,
		getPriorityColor
	} from '$lib/utils.js';

	let {
		task,
		onToggleComplete,
		onDelete,
		onEdit
	} = $props();

	let showDeleteConfirm = $state(false);
	let isDeleting = $state(false);

	const imageUrl = $derived(task.image_path ? getImageUrl(task.image_path) : null);
	const overdue = $derived(isOverdue(task.deadline) && !task.completed);
	const daysText = $derived(getDaysRemainingText(task.deadline));
	const priorityColor = $derived(getPriorityColor(task.priority));

	async function handleToggleComplete() {
		await onToggleComplete(task.id, !task.completed);
	}

	async function handleDelete() {
		isDeleting = true;
		await onDelete(task.id);
		showDeleteConfirm = false;
		isDeleting = false;
	}
</script>

<div
	class="rounded-lg border bg-gray-900 p-4 transition hover:border-gray-700 {overdue
		? 'border-red-500 bg-red-950'
		: task.completed
			? 'border-green-500 bg-green-950'
			: 'border-gray-800'}"
>
	<div class="flex items-start gap-4">
		<!-- Checkbox -->
		<div class="pt-1">
			<input
				type="checkbox"
				checked={task.completed}
				onchange={handleToggleComplete}
				class="h-5 w-5 cursor-pointer rounded border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-gray-500"
			/>
		</div>

		<!-- Contenido principal -->
		<div class="flex-1">
			<!-- Descripción -->
			<p
				class="mb-2 text-lg {task.completed
					? 'text-gray-500 line-through'
					: overdue
						? 'font-semibold text-red-300'
						: 'text-white'}"
			>
				{task.description}
			</p>

			<!-- Metadatos -->
			<div class="mb-3 flex flex-wrap items-center gap-3 text-sm">
				<!-- Prioridad -->
				<span class="rounded-full border px-3 py-1 font-medium {priorityColor}">
					{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
				</span>

				<!-- Fecha límite -->
				<div class="flex items-center gap-1 text-gray-400">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<span>{formatDate(task.deadline)}</span>
				</div>

				<!-- Días restantes -->
				{#if !task.completed}
					<span
						class="font-medium {overdue
							? 'text-red-600'
							: getDaysRemainingText(task.deadline).includes('Vence hoy')
								? 'text-orange-600'
								: 'text-blue-600'}"
					>
						{daysText}
					</span>
				{/if}
			</div>

			<!-- Imagen -->
			{#if imageUrl}
				<div class="mb-3">
					<img
						src={imageUrl}
						alt="Adjunto de tarea"
						class="h-48 rounded-lg object-cover shadow"
					/>
				</div>
			{/if}

			<!-- Fecha de creación -->
			<p class="text-xs text-gray-500">
				Creada: {formatDate(task.created_at)}
			</p>
		</div>

		<!-- Botones de acción -->
		<div class="flex flex-col gap-2">
			<button
				onclick={() => onEdit(task)}
				class="rounded-lg border border-gray-700 bg-gray-800 p-2 text-white transition hover:bg-gray-700"
				aria-label="Editar tarea"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
					/>
				</svg>
			</button>

			<button
				onclick={() => (showDeleteConfirm = true)}
				class="rounded-lg border border-red-900 bg-red-950 p-2 text-red-400 transition hover:bg-red-900"
				aria-label="Eliminar tarea"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					/>
				</svg>
			</button>
		</div>
	</div>
</div>

<!-- Modal de confirmación de eliminación -->
{#if showDeleteConfirm}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
		<div class="w-full max-w-md rounded-lg border border-gray-800 bg-gray-950 p-6 shadow-xl">
			<h3 class="mb-4 text-xl font-bold text-white">¿Eliminar tarea?</h3>
			<p class="mb-6 text-gray-400">Esta acción no se puede deshacer.</p>
			<div class="flex gap-3">
				<button
					onclick={() => (showDeleteConfirm = false)}
					class="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 font-medium text-white transition hover:bg-gray-700"
					disabled={isDeleting}
				>
					Cancelar
				</button>
				<button
					onclick={handleDelete}
					class="flex-1 rounded-lg border border-gray-800 bg-white px-4 py-2 font-medium text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={isDeleting}
				>
					{isDeleting ? 'Eliminando...' : 'Eliminar'}
				</button>
			</div>
		</div>
	</div>
{/if}
