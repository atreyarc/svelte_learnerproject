<!--
	This is ONE component.
	In main.js, you would have imported app.Svelte and initialized it using default variables.
	There can be multiple components as such enabling the same. 
-->


<script>
import { text } from "svelte/internal";
import { tick } from "svelte";
import ContactCard from "./ContactCard.svelte"
import Modal from "./Modal.svelte"
/*
Another way of doing the above is adding it directly in main.js and defining the target div. Currently, target div is set as document.body. This can be identified as any other div.
Pascal case definition of components is IMPORTANT. Svelte treats all lowercase as HTML. PascalCase is treated as Svelte components.

Properties of ContactCard.svelte can be set in this component now.

"Tick" is a special function like onMount, beforeUpdate, afterUpdate and onDestroy [see Modal.svelte]. Tick handles situations within the DOM update. It returns a promise that the consecutive actions will be done after the DOM update is complete. Details under transform().
*/
	export let name;
	export let age = 40;
	//declaring and creating as properties
	let jobDescription = "";
	let jobTitle = "";
	let imgSrc="";
	let formstate = 'empty';
	//let contactProps;
	let arrayContactProps = [];
	let strPassword = '';
	let arrayPassword = [];
	let showModal = false;
	let targetAgreed = false;
	let textarea_value="This is some text";
	
	function changeAge(){
		age -=1;
	}
	function changeName(){
		name = "Roy";
	}

	$: console.log(targetAgreed);
	$: uppercaseName = name.toUpperCase();
	//$ signifies a labelled statement. In this csae UppercaseName will be recalculated every time name is recalculated.
	$: console.log(name);

	$: if(name==="Roy"){age= 20;}

	function inputChange(event){
		console.log("Change is captured");
		name=event.target.value;
	}
	function jobDescriptionChange(event){
		jobDescription = event.target.value;
	}

	function addContact(){
		if(
			name.trim().length == 0 ||
			jobTitle.trim().length == 0 ||
			imgSrc.trim().length == 0 ||
			jobDescription.trim().length == 0
		){
			formstate = 'invalid';
			return;
		}
		else{
			//Setting up the contactProps key:value pair
			// contactProps = {
			// 	propName:name, 
			// 	propJobTitle:jobTitle, propJobDescription:jobDescription, propImgSrc:imgSrc
			// }
			
			//Updating the properties in an array
			//Note: If we push/pop then Svelte will not be able to detect. Svelte will be trieggered by the '=' action.
			//The[...] functionality appends the parameters that are passed as a new element in the array
			arrayContactProps = [...arrayContactProps,
			{
				id: Math.random(), //in ideal situation this would be connected to a database, and the ID will be generated thus.
				propName:name, 
				propJobTitle:jobTitle, 
				propJobDescription:jobDescription, 
				propImgSrc:imgSrc
			}];

			formstate = 'done';
		}
	}

	function deleteLast(){
		arrayContactProps = arrayContactProps.slice(1);
	}

	function deleteFirst(){
		arrayContactProps = arrayContactProps.slice(0, -1);
	}

	function addPassword(){
		arrayPassword = [...arrayPassword,{
			id: Math.random(),
			propPassword:strPassword
		}]
	}

	function deletePassword(idx){
		arrayPassword = arrayPassword.filter((password, index) => {
			return index !== idx;
		});
	}
	
	function transform(event){
		console.log("function called");
		if(event.which !=9){return;}
		event.preventDefault();
		const selectStart = event.target.selectionStart;
		const selectEnd = event.target.selectionEnd;
		const value = event.target.value;

		textarea_value = value.slice(0,selectStart) + value.slice(selectStart, selectEnd).toUpperCase() + value.slice(selectEnd);

		/*
			Tick returned a promise. After the promise is resolved, the activities will be done. This ensures the context within the function is maintained will executing activities. 
		*/
		tick().then(() => {
			event.target.selectionStart = selectStart;
			event.target.selectionEnd=selectEnd;
		});
	}
</script>

<main>
	<h1>Hello {uppercaseName}, my age is {age}!</h1>
	<!--You can have single line / non-complex java script statements here but best practice is to do transformations within script tags/ functions-->
	<button on:click={changeAge} >click to change age</button>
	<button on:click={changeName} >click to change name</button>

	<!-- <input type="text" value={name} on:change={inputChange}/>-->
		<!--default set to name variable. On change - calling the inputchange function. This is a unidirectional flow -->
	<form>
		<!-- svelte-ignore a11y-label-has-associated-control -->
			<label>User Name</label>
			<input type="text" bind:value="{name}"/>
			<!--bi-directional value. should be used with caution. In general you should have control on your data flows. In this way, Svelte takes care of the data integration. This is also done in realtime, whereas the on change function triggers only when mouse click outside of referred element-->
			
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label>Job Title</label>
			<input type="text" bind:value={jobTitle} />
			
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label>Img URL</label>
			<input type="text" bind:value={imgSrc} />

			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label>Job Description</label>
			<textarea rows="3" on:change={jobDescriptionChange}/> <!--One way of doing it-->

			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label>Enter password</label>
			<input type="password" bind:value={strPassword}/>

			<button on:click|preventDefault ={addContact} type ="submit">Click to add contact</button>
			<!--On click has a few modifiers. Prevent default is one of them. This disables the default function of refresh of form when submit button is clicked and enables complete client side handling.-->
		</form>
	
	<button on:click={deleteFirst}>Delete first</button>
	<button on:click={deleteLast}>Delete last</button>
	
	<!--Binding Contact Card properties with data from app.svelte-->
	{#if formstate === 'invalid'}
		<p>Please enter values</p>
	{:else}
		<p>Please enter some data and hit the button</p>
	{/if}
	<!--The each loop enables us to iterate through the array object. Note - the each condition will only take iterable objects. We need to add a unique ID to ensure any removal of data is done properly. Svelte by default updates the DOM first and then retrofits the data into the array. This is circumvented by ensuring every item is connected by an ID-->
	{#each arrayContactProps as contactList, i}
		<h2># {i + 1}</h2>
		<ContactCard 
				userName = {contactList.propName} 
				jobDescription = {contactList.propJobDescription} 
				jobTitle = {contactList.propJobTitle}
				imgSrc = {contactList.propImgSrc}
			/>
			{:else}
				<p>No content. Please start adding some content</p>
	{/each}

	<!--Password validation-->
	{#if strPassword.length < 5 || strPassword.length > 10}
		<p>Password lengths are not met.</p>
	{:else}
		<button on:click="{addPassword}">Add Password</button>
	{/if}
	<ul>
		{#each arrayPassword as pwd, i (pwd.id)}
			<li on:click="{deletePassword.bind(this, i)}">Password #{i + 1} is {pwd.propPassword}</li>
		{/each}
	</ul>


	<!--Binding Contact Card properties with data from app.svelte-->
<!-- 
	{#if formstate==='done'}
	<ContactCard 
		userName = {name} 
		{jobDescription} 
		{jobTitle}
		{imgSrc}
	/>
	{:else if formstate === 'invalid'}
		<p>Please enter valid data</p>
	{:else}
		<p>Please enter some data and hit the button!</p>
	{/if} -->
	<!--Shortcut to use when target prop name and input value is the same-->
	<!--Note the if condition. This is a block statement. The '#' marks the beginning and "/" marks the end. There can be multiple conditions here - and multiple mark up statements between. All of these statements will function only if the condition within the if condition is true-->

	<button on:click="{() => {showModal = true}}">Show Modal</button>
	<!--Working with slots. Slot name: Modal
		didAgree is a slot property defined in Modal.svelte

	-->
	{#if showModal}
		<Modal
			on:cancel={() => (showModal = false)}
			on:close={() => (showModal = false)}
			let:didAgree = {targetAgreed}
		>
			<h1 slot="header">hi</h1>
			<p>This works</p>
			<p>But does it?</p>
			<button slot="footer" on:click={() => {showModal = false}} disabled={!targetAgreed}>Confirm</button> 
		</Modal>;
	{/if}
</main>
<textarea rows="5" value="{textarea_value}" on:keydown={transform} />
<!--CSS-->
<style>
	/*This style is scoped only in app.svelte. Also Svelte will remove any unused code.*/
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		/*text-transform: uppercase;*/
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>