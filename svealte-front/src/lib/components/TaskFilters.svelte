<script>
	let {
		filters = $bindable({
			search: '',
			priority: '',
			dateFrom: '',
			dateTo: ''
		}),
		onApplyFilters,
		onClearFilters
	} = $props();

	let showFilters = $state(false);

	function handleApplyFilters() {
		onApplyFilters();
		showFilters = false;
	}

	function handleClearFilters() {
		filters.search = '';
		filters.priority = '';
		filters.dateFrom = '';
		filters.dateTo = '';
		onClearFilters();
		showFilters = false;
	}

	const hasActiveFilters = $derived(
		filters.search || filters.priority || filters.dateFrom || filters.dateTo
	);
</script>

<div class="mb-6 rounded-lg border border-gray-800 bg-gray-950 p-4">
	<!-- Barra de búsqueda principal -->
	<div class="flex flex-wrap gap-3">
		<div class="flex-1">
			<input
				type="text"
				bind:value={filters.search}
				placeholder="Buscar tareas por descripción..."
				class="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
			/>
		</div>

		<button
			onclick={handleApplyFilters}
			class="rounded-lg border border-gray-800 bg-white px-6 py-2 font-medium text-black transition hover:bg-gray-100"
		>
			Buscar
		</button>

		<button
			onclick={() => (showFilters = !showFilters)}
			class="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 font-medium text-white transition hover:bg-gray-700"
		>
			{showFilters ? 'Ocultar' : 'Filtros'}
			{#if hasActiveFilters}
				<span class="ml-1 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
			{/if}
		</button>

		{#if hasActiveFilters}
			<button
				onclick={handleClearFilters}
				class="rounded-lg border border-red-900 bg-red-950 px-4 py-2 font-medium text-red-400 transition hover:bg-red-900"
			>
				Limpiar
			</button>
		{/if}
	</div>

	<!-- Filtros avanzados -->
	{#if showFilters}
		<div class="mt-4 grid grid-cols-1 gap-4 border-t border-gray-800 pt-4 md:grid-cols-3">
			<!-- Prioridad -->
			<div>
				<label for="priority-filter" class="mb-1 block text-sm font-medium text-gray-300">
					Prioridad
				</label>
				<select
					id="priority-filter"
					bind:value={filters.priority}
					class="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
				>
					<option value="">Todas</option>
					<option value="baja">Baja</option>
					<option value="media">Media</option>
					<option value="alta">Alta</option>
				</select>
			</div>

			<!-- Fecha desde -->
			<div>
				<label for="date-from" class="mb-1 block text-sm font-medium text-gray-300">
					Fecha desde
				</label>
				<input
					id="date-from"
					type="date"
					bind:value={filters.dateFrom}
					class="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
				/>
			</div>

			<!-- Fecha hasta -->
			<div>
				<label for="date-to" class="mb-1 block text-sm font-medium text-gray-300">
					Fecha hasta
				</label>
				<input
					id="date-to"
					type="date"
					bind:value={filters.dateTo}
					class="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
				/>
			</div>
		</div>
	{/if}
</div>
