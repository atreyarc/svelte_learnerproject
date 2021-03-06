<script>
    import {createEventDispatcher, onMount, onDestroy, beforeUpdate, afterUpdate} from 'svelte';
    /*
        The above line enables the creation of custom events. We are importing from 'svelte' [default library].
        createEventDispatcher: the capability of bubbling up events to higher layers.
        onMount: scripts within this function are run AFTER the script block is run.
        onDestroy: scripts within this function is run when we are dismissing the DOM elements called by this function.
    */
    export let content;
    let agreed = false;
    const dispatch = createEventDispatcher();
    let agreedStatus = false;

    /*
        The below block of code showcases the sequence of execution of events. 
        beforeUpdate runs first as it signifies an update to the DOM.
        afterUpdate will run after the update cycle is complete. In sequence of load - beforeUpdate -> onMount -> afterUpdate. onDestroy is called alone.
        The onMount function is a good place to plug in loaders or call other functions which should be triggered on load of the modal.
        The onDestroy function is a good place to call in default return events and handle state change.
    */
    onMount(() => {
        console.log("Mounted");
    });
    onDestroy(() => {
        console.log("Destroyed");
    });

    console.log("All scripts executed");

    //Note that beforeUpdate and afterUpdate runs during every DOM update. To ensure selected run of afterUpdate function, set a logical value in beforeUpdate related to the DOM that is updated 
    beforeUpdate(() => {
        console.log("before update");
        agreedStatus = agreed; //checks if a value is updated just before executing afterUpdate
    });
    
    afterUpdate(()=> {
        console.log("after update");
        if(agreedStatus){
            const modalObj = document.querySelector('.modal');
            modalObj.scrollTo(0,modalObj.scrollHeight);
        }
    })
</script>

<div class="backdrop" on:click="{() => dispatch('cancel')}"></div>
<div class="modal">
    <header>
        <slot name="header"></slot>
    </header>
    <div class="content">
        <slot>{content}</slot>
        <p>Before you continue you need to agree to our T&Cs!</p>
        <button on:click={() => (agreed = true)}>Agreed</button>
    </div>
    <footer>
        <slot name="footer" didAgree={agreed}>
            <button on:click="{() => dispatch('close')}" disabled={!agreed}>Close</button>
        </slot>
    </footer>
    <!--
        Slots:
            Whenever there is no name to a slot, any html from the target which does not have a defined slot would be put in there.
            Whenever there is HTML defined here, but no HTML defined in the target, the HTML from the slot definition will be rendered.
            Whenever there is HTML defined in target, it will overwrite slot definition from source.
        Custom events:
            We are defining two custom events here. Note the syntax: dispath('targetfunctionname'). What ever is defined in the targetfunctionname is called as on:targetfunctionname from target file. It is used in target file in the same way as on:click.
        Slot properties:
            We are passing the slot property "didAgree" of footer into App.svele. This enables a bubble up pass through for the event.
    -->
</div>

<style>
    .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    z-index: 10;
  }

  .modal {
    padding: 1rem;
    position: fixed;
    top: 10vh;
    left: 10%;
    width: 80%;
    max-height: 15vh;
    background: white;
    border-radius: 5px;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    overflow: scroll;
  }

  header {
    border-bottom: 1px solid #ccc;
  }
</style>