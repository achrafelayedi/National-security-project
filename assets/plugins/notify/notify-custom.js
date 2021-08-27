var notes = $('#notes').notify({
	removeIcon: '<i class="icon-times"></i>'
});

var messages = $('#messages').notify({
	type: 'messages',
	removeIcon: '<i class="icon-times"></i>'
});

$('.add-message').on('click', function() {
	messages.show("I'm a message and I will quickly alert you", {
		title: 'Hello'
	});
});

$('.add-success-message').on('click', function() {
	messages.show("I'm a message and I will quickly alert you", {
		type: 'success',
		title: 'Hello',
		icon: '<i class="icon-tick-outline"></i>'
	});
});

$('.add-info-message').on('click', function() {
	messages.show("I'm a message and I will quickly alert you", {
		type: 'info',
		title: 'Hello',
		icon: '<i class="icon-info-large-outline"></i>'
	});
});

$('.add-warning-message').on('click', function() {
	messages.show("I'm a message and I will quickly alert you", {
		type: 'warning',
		title: 'Hello',
		icon: '<i class="icon-flag-outline"></i>'
	});
});

$('.add-danger-message').on('click', function() {
	messages.show("I'm a message and I will quickly alert you", {
		type: 'danger',
		title: 'Hello',
		icon: '<i class="icon-info-outline"></i>'
	});
});

$('.add-sticky-message').on('click', function() {
	messages.show("I'm a message and I will quickly alert you", {
		title: 'Hello',
		sticky: true
	});
});



$('.add-noti').on('click', function() {
	notes.show("I'm a notification I will quickly alert you as well!", {
		title: 'Hello'
	});
});

$('.add-success-noti').on('click', function() {
	notes.show("I'm a notification I will quickly alert you as well!", {
		type: 'success',
		title: 'Hello',
		icon: '<i class="icon-tick-outline"></i>'
	});
});

$('.add-info-noti').on('click', function() {
	notes.show("I'm a notification I will quickly alert you as well!", {
		type: 'info',
		title: 'Hello',
		icon: '<i class="icon-info-large-outline"></i>'
	});
});

$('.add-warning-noti').on('click', function() {
	notes.show("I'm a notification I will quickly alert you as well!", {
		type: 'warning',
		title: 'Hello',
		icon: '<i class="icon-flag-outline"></i>'
	});
});

$('.add-danger-noti').on('click', function() {
	notes.show("I'm a notification I will quickly alert you as well!", {
		type: 'danger',
		title: 'Hello',
		icon: '<i class="icon-info-outline"></i>'
	});
});

$('.add-sticky-noti').on('click', function() {
	notes.show("I'm a notification I will quickly alert you as well!", {
		title: 'Hello',
		sticky: true
	});
});