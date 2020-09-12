<script>
    export let userName;
    export let jobTitle;
    export let jobDescription;
    export let imgSrc;
    ///The export keyword makes a property of this component. This will be possible to be set from any other component, that refers to this file. In this case, app.svelte.
</script>

<div class="contact-card">
    <header>
    <!--<div class={imgSrc ? 'thumb' : 'thumb thumb_empty'}>-->
    <!--Longer way to do it-->
    <div class="thumb" class:thumb_empty="{!imgSrc}">
    <!--Short cut to achieve the same-->
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src={imgSrc} alt={userName}/>
    </div>
    <div class="user-data">
        <h1>{userName}</h1>
        <h2>{jobTitle}</h2>
    </div>
    </header>
    <div class="description">
        <p>{@html jobDescription}</p>
        <!--This means that the text in the job description field will be treated as html. We need to be very careful while using this as this nature of code is vulnerable to cross site scripting attacks.-->
    </div>
</div>


<style>
    /*This style is scoped only in ContactCard.svelte. Also Svelte will remove any unused code.*/
    .contact-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
      max-width: 30rem;
      border-radius: 5px;
      margin: 1rem 0;
    }
  
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 7rem;
    }
  
    .thumb {
      width: 33%;
      height: 100%;
    }

    .thumb_empty{
      background-color: #ccc;
    }
  
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  
    .user-data {
      width: 67%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  
    h1 {
      font-size: 1.25rem;
      font-family: "Roboto Slab", sans-serif;
      margin: 0.5rem 0;
    }
  
    h2 {
      font-size: 1rem;
      font-weight: normal;
      color: #5a5a5a;
      margin: 0;
      margin-bottom: 0.5rem;
    }
  
    .description {
      border-top: 1px solid #ccc;
      padding: 1rem;
    }
  </style>