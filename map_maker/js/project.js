function load_map_list() {

	//console.log( "Load sprite list" );

	/* Clear sprite list */
	$( "#map_list .sortable" ).html( "" );
	$( "#map_list .sortable li" ).css( "color", "#000" );
		
	/* Groups */
	sort_maps_by_order();

	$.each( project.maps, function( key, value ) {
		$( "#map_list .sortable" ).append( '<li class="ui-state-default" map_id="'+value.id+'">'+value.order+': '+value.name+' ('+value.id+')</li>' );
	} );

	/* Clear the current sprite id */
	selected_sprite.sprite = false;

	/* Set the icons */
	$( "#toolbar_new_group" ).css( "display", "block" );
	$( "#toolbar_new_sprite" ).css( "display", "none" );
	$( "#toolbar_back" ).css( "display", "none" );
	$( "#container #sidebar #sprite_list_toolbar #toolbar_right" ).css( "display", "none" );
}

function sort_maps_by_order() {
	project.maps.sort( function( a, b ) {
		return ((a.order < b.order) ? -1 : ((a.order > b.order) ? 1 : 0));
	} );
}