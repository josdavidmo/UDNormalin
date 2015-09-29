A = new Atributo("A");
B = new Atributo("B");
C = new Atributo("C");
D = new Atributo("D");
E = new Atributo("E");
F = new Atributo("F");

atributos = new Array(A, B, C, D, E, F);

implicado1 = new Array(A, B);
implicante1 = new Array(C);
df1 = new DependenciaFuncional(implicado1, implicante1);
implicado2 = new Array(D);
implicante2 = new Array(E, F);
df2 = new DependenciaFuncional(implicado2, implicante2);
implicado3 = new Array(C);
implicante3 = new Array(A);
df3 = new DependenciaFuncional(implicado3, implicante3);
implicado4 = new Array(B, E);
implicante4 = new Array(C);
df4 = new DependenciaFuncional(implicado4, implicante4);
implicado5 = new Array(B, C);
implicante5 = new Array(D);
df5 = new DependenciaFuncional(implicado5, implicante5);
implicado6 = new Array(C, F);
implicante6 = new Array(B, D);
df6 = new DependenciaFuncional(implicado6, implicante6);
implicado7 = new Array(A, C, D);
implicante7 = new Array(B);
df7 = new DependenciaFuncional(implicado7, implicante7);
implicado8 = new Array(C, E);
implicante8 = new Array(A, F);
df8 = new DependenciaFuncional(implicado8, implicante8);

dependenciasFuncionales = new Array(df1, df2, df3, df4, df5, df6, df7, df8);


