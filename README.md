# Getting Started
- npm install
- npm install -g sequelize sequelize-cli (optional, if you have already installed it is not necessary)
- change password in config/config.json/"password": "Your_Password",
- sequelize db:create
- sequelize db:migrate
- sequelize db:seed:all
- npm i -g nodemon (optional, if you have already installed it is not necessary)
- npm start


**IF YOU WANT TEST IN POSTMAN, YOU CAN IMPORT FILE posmant.json**

## Available End Points

### [Get | Content : http://localhost:5000/content/data] :
Menampilkan semua data yang ada dalam tabel content, output yang dihasilkan bertipe Array Of Object.

Contoh penerapan di frontend :

  useEffect(() => {
    const getContent = async () => {
      <!-- Hit Api -->
      const response = await axios.get(`http://localhost:5000/content/data`);
      <!-- Set Data To UseState -->
      setContent(response.data);
    };
    getContent();
  }, []);

### [Get | Content By Id : http://localhost:5000/content/data/:id] :
Menampilkan data berdasarkan id buku yang ada dalam tabel content, output yang dihasilkan bertipe Object.

Contoh penerapan di frontend :
  <!-- Get Id From Parameter -->
  const { id } = useParams();

  useEffect(() => {
    const getProductById = async () => {
      <!-- Hit Api -->
      const response = await axios.get(`http://localhost:5000/products/1`);
      <!-- Set Data To UseState -->
      setContent(response.data);
    };
    getProductById();
    <!-- need dependencies id -->
  }, [id]);

### [Get | Content By Search : http://localhost:5000/content/data/search] :
Menampilkan semua data yang ada dalam tabel content berdasarkan hasil query pencarian dari frontend, output yang dihasilkan bertipe Array Of Object.

dapat menampung parameter : 
1. query : berisikan string hasil input pencarian contoh “pokemon”, bernilai default string kosong,
2. page : angka untuk menentukan halaman dalam api optional use, bernilai default integer 0,
3. limit : angka untuk menentukan jumlah data yang akan ditampilkan dalam api, bernilai default integer 10.

penerapan di frontend : 
  <!-- UseState -->
  const [page, setPage] = useState([0]);
  const [limit, setLimit] = useState([10]);
  const [totalData, setTotalData] = useState([0]);
  const [keyword, setKeyword] = useState("");
  const [datas, setData] = useState("");

  useEffect(() => {
    const searchContent = async () => {
      <!-- Hit Api -->
      const response = await axios.get(
        `http://localhost:5000/content/data/search?query=${keyword}&page=${page}&limit=${limit}`
      );
      <!-- Set Data To UseState -->
      setData(response.data.result);
      setTotalData(response.data.totalData);
    };
    searchContent();
    <!-- need dependencies page, keyword, limit-->
  }, [page, keyword, limit]);

  Note :
  <!-- limit and page are optional, you can add them or not -->
  `http://localhost:5000/content/data/search?query=${keyword}`


### [POST | LOGIN : http://localhost:5000/login] :
Membuat access token kalau data yang diinputkan sesuai dengan data yang terdapat dalam database tabel users, output yang dihasilkan bertipe Obejct.

harus memberikan data : 
1. usename 
2. password

penerapan di frontend : 
  <!-- UseState -->
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    <!-- Hit Api -->
    await axios.post(`http://localhost:5000/login`,{
      <!-- Key = data yang dibutuhkan untuk login, Value = data yang di set di useState -->
      username: username,
      password: password
    });
  };


### [PATCH | ADD PAGE VIEWS : http://localhost:5000/pageviews] :
Memrubah jumlah page views pada buku tertentu berdasarkan id dalam tabel content.

harus memberikan data : 
1. id {bookId}

penerapan di frontend : 
  <!-- UseState -->
  const [bookId, setBookId] = useState("");

  useEffect(() => {
    const incPageViews = async () => {
      <!-- Hit Api -->
      await axios.post(`http://localhost:5000/pageviews`,{
        <!-- Key = data yang dibutuhkan untuk update page views, Value = data yang di set di useState -->
        id: bookId,
      });
    };
    incPageViews();
  }, []);

**NOTE : untuk key/data yang wajib dikirimkan itu agak sensitif harus lowercase/camelcase {contoh di bagian : harus memberikan data}, kalau berbeda saat input maka tidak akan ada perubahan di database.**


## NEED AUTHENTICATION / LOGIN ACCESS 

### [POST | CREATE DATA CONTENT : http://localhost:5000/content/create] :
Membuat data content kedalam database tabel contents.

harus memberikan data : 
1. title,
2. file,
3. sinopsis,
4. stories,
5. genres,
6. releaseDate,

penerapan di frontend : 
  <!-- UseState -->
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [sinopsis, setSinopsis] = useState("");
  const [stories, setStories] = useState("");
  const [genres, setGenres] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const createContent = async () => {
    <!-- Hit Api -->
    await axios.post(`http://localhost:5000/content/create`,{
      <!-- Key = value yang dibutuhkan untuk create content, Value = data yang di set di useState -->
      title: title,
      file: file,
      sinopsis: sinopsis,
      stories: stories,
      genres: genres,
      releaseDate: releaseDate,
    });
  };

**NOTE :untuk key/data yang wajib dikirimkan itu agak sensitif harus lowercase/camelcase {contoh di bagian : harus memberikan data}, kalau berbeda saat input maka data di database akan NULL.**


### [PATCH | UPDATE DATA CONTENT : http://localhost:5000/content/update/:id] :
Mengupdate data content yang ada di dalam database tabel contents.

data yang dapat di update : 
1. title,
2. file,
3. sinopsis,
4. stories,
5. genres,
6. releaseDate,

penerapan di frontend : 
  <!-- UseState -->
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [sinopsis, setSinopsis] = useState("");
  const [stories, setStories] = useState("");
  const [genres, setGenres] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const updateContent = async () => {
    <!-- Hit Api -->
    await axios.patch(`http://localhost:5000/content/update/1`,{
      <!-- Key = value yang dibutuhkan untuk create content, Value = data yang di set di useState -->
      title: title,
      file: file,
      sinopsis: sinopsis,
      stories: stories,
      genres: genres,
      releaseDate: releaseDate,
    });
  };

**NOTE :untuk key/data yang akan dikirimkan itu agak sensitif harus lowercase/camelcase {contoh di bagian : data yang dapat di update}, kalau berbeda saat input maka tidak akan ada perubahan data di database.**


### [DELETE | DELETE DATA CONTENT : http://localhost:5000/content/delete/:id] :
Menghapus data content yang ada di dalam database tabel contents.

data yang dibutuhkan : 
1. id {bookId}

penerapan di frontend : 
  <!-- UseState -->
  const [bookId, setBookId] = useState("");

  const deleteContent = async () => {
    <!-- Hit Api -->
      await axios.delete(`http://localhost:5000/products/${bookId}`);
  };


### [Get | READING LIST : http://localhost:5000/readinglist] :
Menampilkan semua data yang ada dalam tabel readinglists berdasarkan user login, output yang dihasilkan bertipe Array Of Object.

Contoh penerapan di frontend :

  useEffect(() => {
    const getReadingList = async () => {
      <!-- Hit Api -->
      const response = await axios.get(`http://localhost:5000/readinglist`);
      <!-- Set Data To UseState -->
      setContent(response.data);
    };
    getReadingList();
  }, []);


### [POST | CREATE DATA READING LIST : http://localhost:5000/readinglist/add] :
Membuat data reading list kedalam database tabel readinglists.

harus memberikan data : 
1. title,
2. poster,
3. sinopsis,
4. stories,
5. genres,
6. releaseDate,
7. id {book id}
8. username
9. url

penerapan di frontend : 
  <!-- UseState -->
  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState("");
  const [sinopsis, setSinopsis] = useState("");
  const [stories, setStories] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genres, setGenres] = useState("");
  const [bookId, setBookId] = useState("");
  const [username, setUsername] = useState("");
  const [url, setUrl] = useState("");

  const createContent = async () => {
    <!-- Hit Api -->
    await axios.post(`http://localhost:5000/readinglist/add`,{
      <!-- Key = value yang dibutuhkan untuk create content, Value = data yang di set di useState -->
      id: bookId,
      username: username,
      title: title,
      sinopsis: sinopsis,
      poster: poster,
      url: url,
      stories: stories,
      genres: genres,
      releaseDate: releaseDate,
    });
  };

**NOTE :untuk key/data yang wajib dikirimkan itu agak sensitif harus lowercase/camelcase {contoh di bagian : harus memberikan data}, kalau berbeda saat input maka data di database akan NULL.**


### [DELETE | DELETE DATA READING LIST : http://localhost:5000/readinglist/remove] :
Menghapus data reading list yang ada di dalam database tabel readinglists.

data yang dibutuhkan : 
1. id {bookId}

penerapan di frontend : 
  const [bookId, setBookId] = useState("");

  const deleteContent = async () => {
    <!-- Hit Api -->
      await axios.delete(`http://localhost:5000/readinglist/remove`,{
        bookid: bookId
      });
  };