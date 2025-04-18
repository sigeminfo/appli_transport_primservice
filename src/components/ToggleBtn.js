import { CustomElement } from '../utils/componentFactory.js';
export default class ToggleBtn extends CustomElement {
    render() {
        const id = this.getAttribute('idname') || '';
        const css = this.getAttribute('css') || '';
        const value = this.getAttribute('value') || '';

        const div = document.createElement('div');
        div.classList.add('flex', 'toggle');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.classList.add('w-5', 'h-5', 'hidden');
        checkbox.classList.add(...css.split(' '));

        checkbox.checked = (value == "checked");
        console.log("checked");
        console.log(checkbox.checked);
        console.log(value);

        const label = document.createElement('label');
        label.htmlFor = id;
        label.classList.add('relative', 'inline-block', 'w-12', 'h-6', 'bg-slate-200', 'rounded-full', 'cursor-pointer', 'shadow', 'border-[0.5px]', 'transition-all', 'duration-300', 'ease-in-out');

        div.appendChild(checkbox);
        div.appendChild(label);

        this.innerHTML = '';
        this.appendChild(div);
    }
}
customElements.define('sg-toggle-btn', ToggleBtn);