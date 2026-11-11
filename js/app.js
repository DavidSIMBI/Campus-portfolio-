const STORAGE_KEY = "campusflow-data-v1";
const starterData = {
  tasks: [
    {id:1,title:"Review subnetting practice questions",course:"Computer Networks",due:"",priority:"High",done:false},
    {id:2,title:"Finish database normalisation notes",course:"Database Systems",due:"",priority:"Medium",done:false},
    {id:3,title:"Read the JavaScript DOM chapter",course:"Web Development",due:"",priority:"Low",done:true}
  ],
  courses: [
    {id:1,name:"Computer Networks",description:"LAN, VLANs and network fundamentals",progress:65},
    {id:2,name:"Database Systems",description:"SQL, ER modelling and normalisation",progress:42},
    {id:3,name:"Web Development",description:"HTML, CSS and JavaScript",progress:78}
  ],
  notes: [
    {id:1,title:"Remember",body:"A switch forwards frames using MAC addresses. A router connects different IP networks.",created:new Date().toISOString()}
  ]
};
let data = loadData();
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
function loadData(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(starterData)}catch{return structuredClone(starterData)}}
function saveData(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));renderAll()}
function escapeHTML(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function showToast(message){const toast=$("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2300)}
function emptyState(message){return `<div class="empty-state"><i data-lucide="inbox"></i><div>${message}</div></div>`}
function renderTasks(){
  const pending=data.tasks.filter(t=>!t.done), completed=data.tasks.filter(t=>t.done);
  $("#pendingStat").textContent=pending.length;$("#completedStat").textContent=completed.length;$("#taskNavCount").textContent=pending.length;
  const taskHTML=(tasks)=>tasks.length?tasks.map(t=>`<div class="task-row ${t.done?"completed":""}"><input class="task-check" type="checkbox" data-task-check="${t.id}" ${t.done?"checked":""} aria-label="Mark ${escapeHTML(t.title)} complete"><div class="task-info"><strong>${escapeHTML(t.title)}</strong><span>${escapeHTML(t.course||"Personal")} · ${t.due?new Date(`${t.due}T00:00:00`).toLocaleDateString():"No due date"}</span></div><span class="priority ${t.priority.toLowerCase()}">${t.priority}</span><button class="delete-button" data-delete-task="${t.id}" aria-label="Delete task"><i data-lucide="trash-2"></i></button></div>`).join(""):emptyState("Nothing here yet. Add a task to get started.");
  $("#overviewTasks").innerHTML=taskHTML(pending.slice(0,4));
  const q=($("#taskSearch")?.value||"").toLowerCase(), filter=$("#taskFilter")?.value||"all";
  const filtered=data.tasks.filter(t=>(t.title+" "+t.course).toLowerCase().includes(q)&&(filter==="all"||(filter==="pending"&&!t.done)||(filter==="done"&&t.done)));
  $("#allTasks").innerHTML=taskHTML(filtered);
}
function renderCourses(){
  $("#courseStat").textContent=data.courses.length;
  const mini=data.courses.slice(0,4);
  $("#overviewCourses").innerHTML=mini.length?mini.map(c=>`<div class="course-mini"><div class="course-icon"><i data-lucide="book-open"></i></div><div><strong>${escapeHTML(c.name)}</strong><small>${c.progress}% completed</small><div class="progress-track"><span style="width:${c.progress}%"></span></div></div></div>`).join(""):emptyState("Add your first course.");
  $("#allCourses").innerHTML=data.courses.length?data.courses.map(c=>`<article class="course-card"><div class="course-card-top"><div class="course-icon"><i data-lucide="book-open"></i></div><button class="delete-button" data-delete-course="${c.id}" aria-label="Delete course"><i data-lucide="trash-2"></i></button></div><h3>${escapeHTML(c.name)}</h3><p>${escapeHTML(c.description||"A course in your learning journey.")}</p><div class="course-progress-label"><span>Course progress</span><strong>${c.progress}%</strong></div><div class="progress-track"><span style="width:${c.progress}%"></span></div></article>`).join(""):emptyState("No courses yet. Add a course to organise your learning.");
}
function renderNotes(){
  $("#noteStat").textContent=data.notes.length;
  $("#notesGrid").innerHTML=data.notes.length?data.notes.slice().reverse().map(n=>`<article class="note-card"><button class="delete-button" data-delete-note="${n.id}" aria-label="Delete note"><i data-lucide="trash-2"></i></button><h3>${escapeHTML(n.title)}</h3><p>${escapeHTML(n.body)}</p><span class="note-date">${new Date(n.created).toLocaleDateString()}</span></article>`).join(""):emptyState("No notes saved yet.");
}
function renderSchedule(){
  const days=[["MON","Monday","Networking fundamentals","09:00 – 10:30"],["TUE","Tuesday","Database practice","11:00 – 12:30"],["WED","Wednesday","Web development lab","14:00 – 16:00"],["THU","Thursday","Independent study","10:00 – 11:00"],["FRI","Friday","Weekly review & revision","13:00 – 14:00"]];
  $("#scheduleList").innerHTML=days.map(d=>`<div class="schedule-day"><div class="day-name">${d[0]}<span>${d[1]}</span></div><div class="schedule-event"><strong>${d[2]}</strong><small>${d[3]}</small></div></div>`).join("");
}
function renderAnalytics(){
  const total=data.tasks.length, completed=data.tasks.filter(t=>t.done).length, pending=total-completed;
  const completion=total?Math.round((completed/total)*100):0;
  const average=data.courses.length?Math.round(data.courses.reduce((sum,c)=>sum+Number(c.progress||0),0)/data.courses.length):0;
  $("#completionRate").textContent=completion+"%";
  $("#courseAverage").textContent=average+"%";
  $("#pendingAnalytics").textContent=pending;
  const taskChart=$("#taskChart");
  if(!total){taskChart.innerHTML=emptyState("Add tasks to see your progress.");}
  else{
    const doneHeight=Math.max(completed/total*100, completed?5:0);
    const pendingHeight=Math.max(pending/total*100, pending?5:0);
    taskChart.innerHTML=`<div class="donut-wrap"><div class="donut-chart" style="--done:${completion}%"><div class="donut-center"><strong>${completion}%</strong><span>complete</span></div></div></div><div class="chart-summary"><div><strong>${completed}</strong><span>Completed</span></div><div><strong>${pending}</strong><span>Pending</span></div></div>`;
  }
  $("#courseAnalytics").innerHTML=data.courses.length?data.courses.map(c=>`<div class="analytics-course"><div class="analytics-course-heading"><strong>${escapeHTML(c.name)}</strong><span>${Number(c.progress)||0}%</span></div><div class="progress-track"><span style="width:${Math.min(100,Math.max(0,Number(c.progress)||0))}%"></span></div></div>`).join(""):emptyState("Add courses to compare progress.");
}

function renderAll(){renderTasks();renderCourses();renderNotes();renderSchedule();renderAnalytics();if(window.lucide)lucide.createIcons()}
function openDialog(id){$("#"+id).showModal()}
function closeDialog(id){$("#"+id).close()}
function navigate(view){
  $$(".page").forEach(p=>p.classList.remove("active-page"));$("#"+view+"Page").classList.add("active-page");
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  $("#currentSection").textContent=view.charAt(0).toUpperCase()+view.slice(1);
  $("#sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});
}
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));
$("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("campusflow-dark",document.body.classList.contains("dark"));$("#themeToggle").innerHTML=document.body.classList.contains("dark")?'<i data-lucide="sun"></i>':'<i data-lucide="moon"></i>';lucide.createIcons()});
if(localStorage.getItem("campusflow-dark")==="true")document.body.classList.add("dark");
$("#todayLabel").textContent=new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
$("#quickAddTask").addEventListener("click",()=>openDialog("taskDialog"));$("#addTaskButton").addEventListener("click",()=>openDialog("taskDialog"));$("#addCourseButton").addEventListener("click",()=>openDialog("courseDialog"));
$$("[data-close]").forEach(b=>b.addEventListener("click",()=>closeDialog(b.dataset.close)));
$("#taskForm").addEventListener("submit",e=>{e.preventDefault();data.tasks.push({id:Date.now(),title:$("#taskTitle").value.trim(),course:$("#taskCourse").value.trim(),due:$("#taskDue").value,priority:$("#taskPriority").value,done:false});e.target.reset();closeDialog("taskDialog");saveData();showToast("Task added to your list.")});
$("#courseProgress").addEventListener("input",e=>$("#progressValue").textContent=e.target.value+"%");
$("#courseForm").addEventListener("submit",e=>{e.preventDefault();data.courses.push({id:Date.now(),name:$("#courseName").value.trim(),description:$("#courseDescription").value.trim(),progress:Number($("#courseProgress").value)});e.target.reset();$("#progressValue").textContent="25%";closeDialog("courseDialog");saveData();showToast("Course added.")});
$("#noteForm").addEventListener("submit",e=>{e.preventDefault();data.notes.push({id:Date.now(),title:$("#noteTitle").value.trim(),body:$("#noteBody").value.trim(),created:new Date().toISOString()});e.target.reset();saveData();showToast("Note saved.")});
$("#taskSearch").addEventListener("input",renderTasks);$("#taskFilter").addEventListener("change",renderTasks);
document.addEventListener("change",e=>{if(e.target.matches("[data-task-check]")){const task=data.tasks.find(t=>t.id===Number(e.target.dataset.taskCheck));if(task){task.done=e.target.checked;saveData();showToast(task.done?"Task completed!":"Task marked pending.")}}});
document.addEventListener("click",e=>{const task=e.target.closest("[data-delete-task]");const course=e.target.closest("[data-delete-course]");const note=e.target.closest("[data-delete-note]");if(task){data.tasks=data.tasks.filter(t=>t.id!==Number(task.dataset.deleteTask));saveData();showToast("Task deleted.")}if(course){data.courses=data.courses.filter(c=>c.id!==Number(course.dataset.deleteCourse));saveData();showToast("Course deleted.")}if(note){data.notes=data.notes.filter(n=>n.id!==Number(note.dataset.deleteNote));saveData();showToast("Note deleted.")}});
renderAll();
