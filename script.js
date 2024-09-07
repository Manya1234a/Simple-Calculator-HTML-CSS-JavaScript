const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input = "";

keys.forEach(key => {
	const value = key.dataset.key;

	key.addEventListener('click', () => {
		switch (value) {
			case "clear":
				input = "";
			    display_input.innerHTML = "";
			    display_output.innerHTML = "";
				break;
			case "backspace":
				input = input.slice(0, -1);
				updateDisplay(CleanInput(input));
				break;
			case "=":
				try {
					let result = eval(PrepareInput(input));
	
					display_output.innerHTML = CleanOutput(result);
				} catch (error) {
					display_output.innerHTML = "Error";
					console.error("Invalid calculation: ", error);
				}
				
				break;
			case "brackets":
				input += toggleBracket(input);
				updateDisplay(CleanInput(input));
				break;
			default:
				if (ValidateInput(value)) {
					input += value;
					updateDisplay(CleanInput(input));
				}
		}
	});
});

function updateDisplay(inputContent, outputContent = display_output.innerHTML) {
	display_input.innerHTML = inputContent || display_input.innerHTML;
	display_output.innerHTML = outputContent || display_output.innerHTML;
}

function CleanInput(input) {
	return input.replace(/[*\/+\-\(\)%]/g, match => ({
		"*": `<span class="operator">x</span>`,
		"/": `<span class="operator">÷</span>`,
		"+": `<span class="operator">+</span>`,
		"-": `<span class="operator">-</span>`,
		"(": `<span class="brackets">(</span>`,
		")": `<span class="brackets">)</span>`,
		"%": `<span class="percent">%</span>`
	}[match]));
}

function CleanOutput(output) {
	let [intPart, decimal] = output.toString().split(".");
	intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return decimal ? `${intPart}.${decimal}` : intPart;


		

}

function ValidateInput(value) {
	let last_input = input.slice(-1);
	let operators = ["+", "-", "*", "/"];
	return !(value === "." && last_input === ".") && 
		   !(operators.includes(value) && operators.includes(last_input));
}

function PrepareInput(input) {
	return input.replace(/%/g, "/100");
}

function toggleBracket(input) {
	let open = (input.match(/\(/g) || []).length;
	let close = (input.match(/\)/g) || []).length;
	return open > close ? ")" : "(";
}

