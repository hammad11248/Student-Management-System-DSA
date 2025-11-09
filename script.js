const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => { notification.classList.remove('show'); }, 3000);
}

class Node {
    constructor(rollNo,name,dept,email,phone,age){
        this.rollNo=rollNo; this.name=name; this.department=dept; this.email=email; this.phone=phone; this.age=age; this.next=null;
    }
}

class LinkedList{
    constructor(){ this.head=null; this.loadFromStorage(); }

    insert(rollNo,name,dept,email,phone,age){
        if(this.search(rollNo)) return false;
        const newNode=new Node(rollNo,name,dept,email,phone,age);
        if(!this.head){ this.head=newNode; }
        else{ let temp=this.head; while(temp.next){ temp=temp.next; } temp.next=newNode; }
        this.saveToStorage(); return true;
    }

    search(rollNo){ let temp=this.head; while(temp){ if(temp.rollNo===rollNo) return temp; temp=temp.next; } return null; }

    delete(rollNo){
        if(!this.head) return false;
        if(this.head.rollNo===rollNo){ this.head=this.head.next; this.saveToStorage(); return true; }
        let temp=this.head, prev=null;
        while(temp && temp.rollNo!==rollNo){ prev=temp; temp=temp.next; }
        if(!temp) return false;
        prev.next=temp.next; this.saveToStorage(); return true;
    }

    viewAll(){ let arr=[]; let temp=this.head; while(temp){ arr.push(temp); temp=temp.next; } return arr; }

    saveToStorage(){ localStorage.setItem('students',JSON.stringify(this.viewAll())); }

    loadFromStorage(){
        const data=JSON.parse(localStorage.getItem('students'))||[];
        data.forEach(s=>this.insert(s.rollNo,s.name,s.department,s.email,s.phone,s.age));
    }
}

const list=new LinkedList();
const studentTable=document.querySelector("#studentTable tbody");

function renderTable(){
    studentTable.innerHTML="";
    list.viewAll().forEach(student=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${student.rollNo}</td>
                        <td>${student.name}</td>
                        <td>${student.department}</td>
                        <td>${student.email}</td>
                        <td>${student.phone}</td>
                        <td>${student.age}</td>
                        <td>
                            <button class="action-btn delete-btn" data-roll="${student.rollNo}"><i class="fas fa-trash"></i></button>
                        </td>`;
        studentTable.appendChild(tr);
    });
}

document.getElementById('insertForm').addEventListener('submit',e=>{
    e.preventDefault();
    const name=document.getElementById('studentName').value;
    const roll=document.getElementById('rollNo').value;
    const dept=document.getElementById('department').value;
    const email=document.getElementById('email').value;
    const phone=document.getElementById('phone').value;
    const age=document.getElementById('age').value;
    if(list.insert(roll,name,dept,email,phone,age)){ showNotification("Student added successfully!","success"); renderTable(); e.target.reset(); }
    else showNotification("Roll Number already exists!","error");
});

document.getElementById('deleteForm').addEventListener('submit', e => {
    e.preventDefault();
    const roll = document.getElementById('deleteRoll').value;
    if (list.delete(roll)) { showNotification("Student deleted successfully!", "success"); renderTable(); e.target.reset(); }
    else { showNotification("Student not found!", "error"); }
});

document.getElementById('searchForm').addEventListener('submit',e=>{
    e.preventDefault();
    const roll=document.getElementById('searchRoll').value;
    const student=list.search(roll);
    const resultDiv=document.getElementById('searchResult');
    if(student){ resultDiv.style.display="block"; document.getElementById('resultText').innerHTML=`<b>${student.name}</b> (${student.department}) - Email: ${student.email}, Phone: ${student.phone}, Age: ${student.age}`; }
    else{ resultDiv.style.display="block"; document.getElementById('resultText').textContent="Student not found"; }
});

renderTable();
