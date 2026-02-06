let tasksData={}


const todo=document.querySelector('#todo');
const progress=document.querySelector('#progress');
const done=document.querySelector("#done");
let dragElement=null;
if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  for (const col in data) {
    const column = document.querySelector(`#${col}`);

    data[col].forEach(task => {
      const div = document.createElement("div");
      div.classList.add("task");
      div.setAttribute("draggable", "true");

      div.innerHTML = `
        <h2>${task.title}</h2>
        <p>${task.desc}</p>
        <button>Delete</button>       
      `;

      div.addEventListener("drag", () => {
        dragElement = div;
      });
      const deleteButton=div.querySelector("button");
      deleteButton.addEventListener("click",()=>{
        div.remove();
        updateCounts();
      })

      column.appendChild(div);
    });
  }
}

console.log(todo,progress,done);
const tasks=document.querySelectorAll('.task');
tasks.forEach(task=>{
    task.addEventListener("drag",(e)=>{
        dragElement=task;
        // console.log("dragging",e);
    })
})
// to make the dragged image less transparent
tasks.forEach(task => {
  task.addEventListener("dragstart", (e) => {
    task.classList.add("dragging");

    // clone the task for a solid ghost image
    const clone = task.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.top = "-1000px";
    clone.style.left = "-1000px";
    clone.style.opacity = "1";
    clone.style.background = "#2a2a2a";
    clone.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
    clone.style.borderRadius = "10px";

    document.body.appendChild(clone);
    e.dataTransfer.setDragImage(clone, 20, 20);

    // cleanup
    setTimeout(() => document.body.removeChild(clone), 0);
  });

  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");
  });
})
// drag and drop function
function addDragEventOnColumn(column){
    column.addEventListener("dragenter",(e)=>{
        e.preventDefault();
        column.classList.add("hover-over");
    })
    column.addEventListener("dragleave",(e)=>{
        e.preventDefault();
        column.classList.remove("hover-over");
    })
    column.addEventListener("dragover",(e)=>{
        e.preventDefault();
    })
    column.addEventListener("drop",(e)=>{
        e.preventDefault();
        console.log("dropped",dragElement,column);
        column.appendChild(dragElement);
        column.classList.remove("hover-over");
        updateCounts();
        // browser primarily doesn't allow to drop the code on another column or item

    })
    }
addDragEventOnColumn(todo);
addDragEventOnColumn(progress);
addDragEventOnColumn(done);
// progress.addEventListener("dragenter",(e)=>{
//     progress.classList.add("hover-over");
// })

// modal logic
const toggleModalButton=document.querySelector("#toggle-modal");
const modalBg=document.querySelector(".modal .bg");
const modal=document.querySelector(".modal");
const addTaskButton=document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click",()=>{
    modal.classList.toggle("active");
})
modalBg.addEventListener("click",()=>{
    modal.classList.remove("active");
})

function updateCounts() {
  tasksData = {};

  [todo, progress, done].forEach(col => {
    const tasksInCol = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasksInCol).map(task => ({
      title: task.querySelector("h2").innerText,
      desc: task.querySelector("p").innerText
    }));

    count.innerText = tasksInCol.length;
  });

  localStorage.setItem("tasks", JSON.stringify(tasksData));
}



const titleInput = document.querySelector("#task-title-input");
const descInput  = document.querySelector("#task-desc-input");

addTaskButton.addEventListener("click", () => {
  if (!titleInput.value.trim()) return;

  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <h2>${titleInput.value}</h2>
    <p>${descInput.value}</p>
    <button>Delete</button>
  `;

  div.addEventListener("drag", () => {
    dragElement = div;
  });

  div.querySelector("button").addEventListener("click", () => {
    div.remove();
    updateCounts();
  });

  todo.appendChild(div);
  updateCounts();

  // 🔥 CLEAR FIRST
  titleInput.value = "";
  descInput.value = "";

  // 🔥 THEN CLOSE MODAL
  modal.classList.remove("active");
});


