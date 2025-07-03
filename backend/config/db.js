mongoose.connect('mongodb://localhost:27017/bookbuddy');

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected to:', mongoose.connection.name);
});
