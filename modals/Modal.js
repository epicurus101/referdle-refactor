export class Modal {
    
    id;
    modal;
    content;
    span;
    header;
    self;

    constructor(id){
        this.id = id
        this.modal = document.createElement("div")
        this.modal.setAttribute("id", id)
        this.modal.classList.add("modal")
        this.modal.style.display = "block"

        this.content = document.createElement("div")
        this.content.classList.add("modal-content")
        this.modal.appendChild(this.content)


        this.span = document.createElement("span")
        this.span.classList.add("close")
        this.span.classList.add("prevent-select")
        this.span.innerHTML = "&times;"
        this.content.appendChild(this.span)     
        
        this.header = document.createElement("h2")
        this.content.appendChild(this.header)
        this.header.textContent = id
        this.onOpen()
        this.setupClicks()
        self = this;
    }

    replaceHeading(str){
        this.header.textContent = str
    }



    onOpen(){
        console.log(this.id, "opened")
    }

    closeModal(){
        this.onClose()
        document.dispatchEvent(new CustomEvent("closeManagedModal"))
    }

    onClose(){
        console.log(this.id,"has closed")
    }


    setupClicks(){
        this.modal.onclick = function(e) {
            e.stopPropagation()
            self.closeModal()
        }
        this.span.onclick = function(e) {
            e.stopPropagation()
            self.closeModal()
        }
    }
}