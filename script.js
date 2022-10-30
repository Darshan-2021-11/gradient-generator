const body = document.querySelector("body");
const header = document.querySelector("#header"); 
const gradientsContainer = document.querySelector(".gradients-container");
/* Using CSS variables in JS
 *
 *
 const gradientBoxX = 32;
 document.documentElement.style.setProperty('--gradient-x-padding', ` ${gradientBoxX} px`);
 const gradientBoxY = 24;
 document.documentElement.style.setProperty('--gradient-y-padding', ` ${gradientBoxY} px`);
 *
 */

body.style.minHeight =  window.innerHeight + "px";

const hexString = '0123456789abcdef';
const hexStringLen = hexString.length;

class UI{
    randomColor(){
	let color = '#';
	for(let i=0; i<6; i++) color += hexString[Math.floor(Math.random() * hexStringLen)];
    return color;
    }

    generateGradient(){
	const color1 = this.randomColor();
	const color2 = this.randomColor();
	const angle = Math.floor(Math.random() * 360);
    /* We can do this
     *
     return `linear-gradient(${angle}deg, ${color1}, ${color2})`
     *
     * But the colours would be hard to visualise with random angle,
     * that's why we fixed angle to 90deg.
     *
     return `linear-gradient(90deg, ${color1}, ${color2})`;
     *
     * The problem with both of the above format is that, they both contain space in between 
     * which causes problem when using the string with `${}` format later on...
     * So, from now on, always return string output with no spaces in between specially when
     * you have to use it as a variable somewhere else.
     *
     return `linear-gradient(90deg,${color1},${color2})`;
     * 
     * Turns out the spaces do not cause any problem, the problem was caused due to the
     * displayGradients function not using template literal to give a single string to 
     * the input box and was parsing the string till it encountered a space where it 
     * rejected further values it received and just put it to html which did not do the job.
     *   ;(
     *
     * Now, lets add the functionality to the website where we give the hex code of both the
     * colours that we produce randomly too...
     * Nevermind, changed my mind on this topic.
     */
    return {color1:`${color1}`, color2:`${color2}`, CSScode:` linear-gradient(90deg, ${color1}, ${color2})`};

    }

    displayGradients(number){ 
    /*
     *
     *  This does not give any result at all, except the very last element has the 
     *  required CSS code for the gradient. Please check if you could find out what
     *  was wrong with this code, please...
     *
     *  Note: While this error popped out, the return of method generateGradient() was
     *  "return `linear-gradient(90deg, ${color1}, ${color2})`" which might have caused
     *  some issue in this particular problem but I am too lazy to check this as I am 
     *  using neovim and I am new to it ;p
     *
     *
    for(let i=0; i<20; i++){
        const result = `
            <!-- start of Single Gradient -->
            <article class="gradient">
                <div id="gradient${i}" class="gradient-color">
                </div>
                <div class="output-code">
                    <div>CSS : </div>
                    <!-- Used the size=1 in input in HTML and 
                    width to be 100% in CSS to get adaptive input box size -->
                    <input id="code${i}" size=1 disabled></input>
                </div>
            </article>
            <!-- end of Single Gradient -->
            `
        gradientsContainer.innerHTML += result;

        const gradient = document.querySelector(`#gradient${i}`);
        const gradientCode = document.querySelector(`#code${i}`);
            
        /* All the three lines or the final line outside will do the same job
         *
         const gradientColorCode = this.generateGradient();
         gradient.style.background = gradientColorCode;
         gradientCode.value = gradientColorCode;
         *
         /
         gradientCode.value = gradient.style.background = this.generateGradient();

         NOTE: The above two codes did not work because the value must be contained
         inside a template literal to return a single string to input box, it rejected
         further values it received to the html which was bloat and did not do the job.

        /* If not disabled using HTML with innerText 
         gradientCode.disabled = true;
         *
         /
        }
        */

        /* We require a number which will take the height and width of the gradient-container
         * and give that many amounts of gradients needed to fill the entire page
         *
         * We also tried to add some css variables to make the gradients full page, but did
         * not work as intended so here's the code as comment...
         const grads = ((body.offsetHeight-header.offsetHeight) * body.offsetWidth)/((gradientsContainer.offsetHeight - gradientBoxY)*(gradientsContainer.offsetWidth - gradientBoxX));
         *
         */
        for(let i=0; i<number; i++){
            const gradientColorCode = this.generateGradient();
            const result = `
                <!-- start of Single Gradient -->
                <article class="gradient">
                    <div class="gradient-color" style="background: ${gradientColorCode.CSScode};">
                    </div>
                    <div class="code-container">
                        <div>CSS: </div>
                        <!-- Used the size=1 in input in HTML and width to be 100% in CSS to get adaptive input box size -->
                        <input size=1 id="code${i}" value="${gradientColorCode.CSScode}" disabled></input>
                        <button onclick="copy('#code${i}')"><img src="copy-icon.svg"></img></button>
                    </div>
                </article>
                <!-- end of Single Gradient -->
                `
            gradientsContainer.innerHTML += result;
        /*
         * This code does not work after introducing Load More option in site,
         * so hard coded this CSS style into result variable itself...
         const gradient = document.querySelector(`#gradient${i}`);
         gradient.style.background = gradientColorCode.CSScode;
         *
         * Changed the below code to the its next line in result
         <div id="gradient${i}" class="gradient-color">
         <div class="gradient-color style="background: ${gradientColorCode.CSScode};">
         *
         * To pass arguments to `onclick`, we can enclosing the arguments in some quotes'
         * any one inside the brackets ('/"/`) and never worry about errors, because I did
         * not enclosed the onclick on copy button and shown errors for 7-8 hours ;(
         *
         * Instead of this
         <button onclick="copy(#code${i})"><img src="copy-icon.svg"></img></button>
         * 
         * Do this
         <button onclick="copy('#code${i}')"><img src="copy-icon.svg"></img></button>
         */
        }
    }
}

const ui = new UI();

function loadMore(){
    ui.displayGradients(10);
}
function copy(id){
    const inputData = document.querySelector(`${id}`);
	inputData.select();
	document.execCommand("copy");
	alert("Code Copied to Clipboard");
}

document.addEventListener("DOMContentLoaded", () => {
    ui.displayGradients(15);
});

// We need to add another div so that the sticky CSS header does not look like a floating
// element due to the clever hack used for text gradient...
var div = document.createElement('div');
div.style.backgroundColor = `var(--primary-color)`;
/*
 * The problem with first two or second two lines of code is that we are 
 * using template literals but there is __space between the numeric value 
 * and `px` unit__, this breaks CSS and returns nothing as it is not seen 
 * valid CSS code.
div.style.height = ` ${header.offsetHeight} px`;
div.style.width = ` ${header.offsetWidth} px`;
 *
 * or
 *
div.style.height = ` ${header.offsetHeight.toString()} px`;
div.style.width = ` ${header.offsetWidth.toString()} px`;
 * 
 * or at the very most, you could use numeric variables with strings like
 * this :
 * 
div.style.height = header.offsetHeight "px";
div.style.width = header.offsetWidth + 'px';
 */
div.style.height = ` ${header.offsetHeight}px`;
div.style.width = ` ${header.offsetWidth}px`;
div.style.top = ` 0`;
div.style.left = ` 0`;
div.style.position = ` fixed`;
div.style.zIndex = ` 0`;
body.appendChild(div);
