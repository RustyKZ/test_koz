<script>
  import axios from 'axios';
  import cheerio from 'cheerio';

  export default {
    
    name: 'App',
    
    data() {
      return {        
        currentExercise: 1,
        emailEnter: '',
        passwordEnter: '',
        loginIsSuccess: false,
        websiteForChecking: "https://playwright.dev/",
        expectedWebsiteTitle: "Fast and reliable end-to-end testing for modern web apps | Playwright",
        recievedWebsiteTitle: "",
        websiteResponseCode: null,
        orel: 50,
        reshka: 50,
        rebro: 0,
        probability: null,
      }
    },
    
    watch: {
      orel(newVal) {
        this.reshka = newVal;
        this.rebro = 100 - newVal * 2;
      },

      reshka(newVal) {
        this.orel = newVal;
        this.rebro = 100 - newVal * 2;
      },
      rebro(newVal) {
        this.orel = (100 - newVal) / 2;
        this.reshka = (100 - newVal) / 2;
      }
    },

    methods: {

      async goToWebsite() {
        window.open(this.websiteForChecking, '_blank');
        
        try {
          const response = await axios.get(this.websiteForChecking);
          console.log('Status Code:', response.status);
          console.log('response:', response);
          console.log('Page Title:', response.headers['title']); // Пример получения заголовков, если они есть

          const $ = cheerio.load(response.data);              
          const title = $('title').text();
          console.log('Page Title:', title);
          
          this.websiteResponseCode = response.status;
          this.recievedWebsiteTitle = title;

        } catch (error) {
          console.error('Error accessing website:', error);
        }
      },

      getProbabitily() {
        const Porel = this.orel / 100;
        const Preshka = this.reshka / 100;
        const Prebro = this.rebro / 100;
        this.probability = 3 * Math.pow(Porel, 2) * (Preshka + Prebro);
      }

    },

    computed: {

      isEmailCorrect() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
        return emailPattern.test(this.emailEnter);        
      },

      isPasswordCorrect() {
        const lengthIsCorrect = this.passwordEnter.length >= 8
        return lengthIsCorrect;
      },
      
    }

  }

</script>

<template>
  <div class="container">
    <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
      <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">        
        <span class="fs-4">Выберите тестовое задание в меню:</span>
      </a>

      <ul class="nav nav-pills">
        <li @click="currentExercise = 1" class="nav-item me-2"><a href="#" class="nav-link active" aria-current="page">Форма ввода пароля</a></li>
        <li @click="currentExercise = 2" class="nav-item me-2"><a href="#" class="nav-link active" aria-current="page">Веб-страница Playwright</a></li>
        <li @click="currentExercise = 3" class="nav-item"><a href="#" class="nav-link active" aria-current="page">Вероятность падения монеты</a></li>
      </ul>
    </header>
    
    <div v-if="currentExercise === 1">
      <h4 class="title">Форма ввода пароля</h4>
      <div class="window">
        <div class="mb-3">
          <label for="exampleFormEmail" class="form-label">Введите адрес электронной почты:</label><span style="color: red"> *</span>
          <input v-model="emailEnter" type="email" class="form-control mb-4" id="exampleFormEmail" placeholder="name@example.com">
          <label for="exampleFormPassword" class="form-label">Введите пароль:</label><span style="color: red"> *</span>
          <input v-model="passwordEnter" type="password" class="form-control mb-4" id="exampleFormPassword" placeholder="корректный пароль должен содержать минимум 8 символов">
          <div class="mb-5">
            <span style="color: red">*</span><span> - обязательное поле</span>
          </div>
          <button @click="loginIsSuccess = true" v-if="isEmailCorrect && isPasswordCorrect" class="btn btn-secondary">Login</button>
          <button v-else class="btn btn-secondary disabled">Login</button>
        </div>
      </div>
      <h4 v-if="loginIsSuccess" class="title mt-3">Проверка корректности адреса электронной почты прошла успешно.</h4>
      <p v-if="loginIsSuccess" class="title mt-1">
        Адрес электронной почты был проверен на соотвествие синтаксическим паттернам. Однако, нет гарантии, что адрес действительно корректный. Для более детальной проверки следует использовать специализированные сервисы.
      </p>
    </div>

    <div v-if="currentExercise === 2">
      <h4 class="title">Проверка веб-страницы https://playwright.dev/</h4>
      <div class="title">
        <h6>Ожидаемый загловок страницы: </h6><h6>{{ expectedWebsiteTitle }}</h6>
      </div>
      <div class="title">
        <button @click="goToWebsite" class="btn btn-outline-primary">Нажмите для перехода на https://playwright.dev/ (откроется в новой вкладке)</button>
      </div> 
      <div class="title mt-3" v-if="websiteResponseCode === 200" >
        <h4 class="mt-2">Страница с указанным адресом существует и отвечает корректно</h4>
        <h6>Полученный загловок страницы:</h6><h6>{{ recievedWebsiteTitle }}</h6>
        <h6 class="mt-2"><span>Соотвествие ожидаемого и полученного заголовка: </span><span>{{ expectedWebsiteTitle === recievedWebsiteTitle }}</span></h6>
      </div>
      <div v-if="websiteResponseCode === 200" class="title mt-4">
        <p>
          Однако, вероятно, это не совсем то, что ожидалось в задании с учетом вакансии тестировщика. 
          Здесь <a href="https://github.com/RustyKZ/playwright_test" target="_blank">https://github.com/RustyKZ/playwright_test</a> это задание выполнено на Node JS 
          с установленной библиотекой "playwright-test". 
        </p>
      </div>
    </div>

    <div v-if="currentExercise === 3">
      <h4 class="title">Расчет вероятности выпадания ровно двух орлов при трех бросках монеты</h4>
      <div class="window">        
        <h6></h6>
        <div class="row mx-3">
          <div class="col-6 px-4">

            <div class="row mt-4" title="interfaceData.hint_interval">
              <div class="input-group mb-3">
                <span class="input-group-text col-9"> Вероятность выпадания орла, %: </span>                                        
                <input type="number" class="form-control col-3" v-model="orel">
              </div>
              <input type="range" class="form-range" min="0" max="50" step="0.01" id="customRange2" v-model="orel">
            </div>

            <div class="row mt-4" title="interfaceData.hint_interval">
              <div class="input-group mb-3">
                <span class="input-group-text col-9"> Вероятность выпадания решки, %: </span>
                <input type="number" class="form-control col-3" v-model="reshka">
              </div>
              <input type="range" class="form-range" min="0" max="50" step="0.01" id="customRange2" v-model="reshka">
            </div>

            <div class="row mt-4" title="interfaceData.hint_interval">
              <div class="input-group mb-3">
                <span class="input-group-text col-9"> Вероятность вставания на ребро, %: </span>                                        
                <input type="number" class="form-control col-3" v-model="rebro">
              </div>
              <input type="range" class="form-range" min="0" max="100" step="0.01" id="customRange2" v-model="rebro">
            </div>
          </div>

          <div class="col-6">
            <div class="row" style="height: 70%;">
              <div v-if="probability" class="container">
                <div class="row d-flex justify-content-center mx-4" style="height: 30%;">
                  <div class="text-center mx-4">
                    <h4>Вероятность выпадания ровно двух орлов из трех бросков:</h4>
                  </div>
                </div>
                <div class="row d-flex align-items-center text-center" style="height: 70%;">
                  <div style="font-size: 48px"><b>{{ probability }}</b></div>
                </div>                
              </div>
            </div>
            <div class="row d-flex d-flex justify-content-center align-items-center" style="height: 30%;">
              <div class="d-flex justify-content-center align-items-center">
                <button v-if="orel + reshka + rebro === 100 && orel >=0 && reshka >= 0 && rebro >= 0" @click="getProbabitily" class="btn btn-success">Рассчитать</button>
                <button v-else class="btn btn-success disabled">Рассчитать</button>
              </div>
            </div>
          </div>

        </div>

        <div v-if="probability" class="row d-flex align-items-center text-center">
          <div class="col-2"></div>
          <div class="col-8">
            <p class="lh-sm">
              Для расчета вероятности использовалась следующая формула: 
            </p>
            <p>
              <b style="font-size: 24px;">probability = 3 * Math.pow(Orel, 2) * (Reshka + Rebro)</b>
            </p>
            <p class="text-start ms-5">
              3 — это количество комбинаций, в которых орел может выпасть дважды из трех попыток.
              <br>
              Math.pow(Porel, 2) — вероятность того, что орел выпадет ровно два раза.
              <br>
              (Preshka + Prebro) — вероятность того, что третий бросок не даст орла.
            </p>
          </div>
          <div class="col-2"></div>
        </div>

        <div class="row mt-3"></div>
      </div>
    </div>
    
  </div>  
</template>

<style>
  .title {
    padding-left: 16px;
    padding-right: 16px;    
  }

  .window {    
    padding: 16px;
    margin: 16px;
    border-radius: 10px;
    border-style: solid;
    border-width: 1px;
    border-color: lightgrey;    
  }
</style>
