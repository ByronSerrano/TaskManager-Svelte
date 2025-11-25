<script>
	import { formatDateForInput } from '$lib/utils.js';

	let {
		isOpen = $bindable(false),
		onSubmit,
		editingTask = null
	} = $props();

	let description = $state('');
	let deadline = $state('');
	let priority = $state('media');
	let imageFile = $state(null);
	let imagePreview = $state(null);
	let loading = $state(false);

	// Actualizar formulario cuando se edita una tarea
	$effect(() => {
		if (editingTask) {
			description = editingTask.description || '';
			deadline = editingTask.deadline ? formatDateForInput(editingTask.deadline) : '';
			priority = editingTask.priority || 'media';
			imagePreview = null;
		} else {
			resetForm();
		}
	});

	function resetForm() {
		description = '';
		deadline = '';
		priority = 'media';
		imageFile = null;
		imagePreview = null;
	}

	function handleImageChange(event) {
		const file = event.target.files?.[0];
		if (file) {
			imageFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target?.result;
			};
			reader.readAsDataURL(file);
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();
		loading = true;

		try {
			const taskData = {
				description,
				deadline: new Date(deadline).toISOString(),
				priority,
				image: imageFile
			};

			await onSubmit(taskData);
			isOpen = false;
			resetForm();
		} catch (error) {
			alert(`Error: ${error.message}`);
		} finally {
			loading = false;
		}
	}

	function closeModal() {
		isOpen = false;
		resetForm();
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
		<div class="w-full max-w-lg rounded-lg border border-gray-800 bg-gray-950 p-6 shadow-xl">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-2xl font-bold text-white">
					{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
				</h2>
				<button
					onclick={closeModal}
					aria-label="Cerrar modal"
					class="rounded-full p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<form onsubmit={handleSubmit} class="space-y-4">
				<!-- Descripción -->
				<div>
					<label for="description" class="mb-1 block text-sm font-medium text-gray-300">
						Descripción *
					</label>
					<textarea
						id="description"
						bind:value={description}
						required
						rows="4"
						class="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
						placeholder="Describe la tarea..."
					></textarea>
				</div>

				<!-- Fecha límite -->
				<div>
					<label for="deadline" class="mb-1 block text-sm font-medium text-gray-300">
						Fecha límite *
					</label>
					<input
						id="deadline"
						type="datetime-local"
						bind:value={deadline}
						required
						class="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
					/>
				</div>

				<!-- Prioridad -->
				<div>
					<label for="priority" class="mb-1 block text-sm font-medium text-gray-300">
						Prioridad
					</label>
					<select
						id="priority"
						bind:value={priority}
						class="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
					>
						<option value="baja">Baja</option>
						<option value="media">Media</option>
						<option value="alta">Alta</option>
					</select>
				</div>

				<!-- Imagen -->
				<div>
					<label for="image" class="mb-1 block text-sm font-medium text-gray-300">
						Imagen adjunta
					</label>
					<input
						id="image"
						type="file"
						accept="image/*"
						onchange={handleImageChange}
						class="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white file:mr-4 file:rounded-md file:border-0 file:bg-gray-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-700"
					/>
					{#if imagePreview}
						<div class="mt-2">
							<img src={imagePreview} alt="Preview" class="h-32 rounded-lg object-cover" />
						</div>
					{/if}
				</div>

				<!-- Botones -->
				<div class="flex gap-3 pt-2">
					<button
						type="button"
						onclick={closeModal}
						class="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 font-medium text-white transition hover:bg-gray-700"
						disabled={loading}
					>
						Cancelar
					</button>
					<button
						type="submit"
						class="flex-1 rounded-lg border border-gray-800 bg-white px-4 py-2 font-medium text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={loading}
					>
						{loading ? 'Guardando...' : editingTask ? 'Actualizar' : 'Crear'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
