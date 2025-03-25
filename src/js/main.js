AOS.init({
	duration: 800, // Délka animace v milisekundách (default: 400)
	easing: 'ease-in-out', // Typ animace (default: "ease")
	offset: 100, // Posun před spuštěním animace (default: 120)
	delay: 200, // Zpoždění animace (default: 0)
	once: true, // Animace se spustí jen jednou (default: false)
	mirror: false, // Animace se opakuje při scrollování zpět (default: false)
	anchorPlacement: 'top-bottom', // Kdy se animace spustí (viz níže)
});

// Určuje kdy se animace spustí vzhledem k viewportu:
//🔹 "top-bottom" (default) → spustí se, když se horní část elementu dotkne spodku viewportu.
//🔹 "top-center" → spustí se, když se horní část elementu dostane doprostřed viewportu.
//🔹 "bottom-bottom" → spustí se, když spodní část elementu dorazí na spodní okraj viewportu.

console.log('prostor pro JS');
