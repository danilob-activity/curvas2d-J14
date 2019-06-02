function Vec2(){
    this.x = 0;
    this.y = 0;
}

function Vec2(x,y){
    this.x = x;
    this.y = y;
}

Vec2.prototype.set = function(x,y) {
    this.x = x;
    this.y = y;
}

Vec2.prototype.show = function(x,y) {
    console.log("x: "+this.x+", y:"+this.y);
}

function Table_Entry(){
    this.u=0;
    this.length=0;
}

function Table_Entry(u,length){
    this.u=u;
    this.length=length;
}

Table_Entry.prototype.set = function(x,y) {
    this.u = x;
    this.length = y;
}


Table_Entry.prototype.showTableEntry = function() {
    console.log("u: "+this.u.toFixed(4)+" | length:"+this.length.toFixed(4));
}

function Interval_Structure(){
    this.u1 = 0;
    this.u2 = 0;
    this.length = 0;
}

function Interval_Structure(u1,u2,length){
    this.u1 = u1;
    this.u2 = u2;
    this.length = length;
}

Interval_Structure.prototype.showIntervalStructure = function() {
    console.log("[u1: "+this.u1.toFixed(4)+", u2: "+this.u2.toFixed(4)+" | length:"+this.length.toFixed(4));
}

function Polynomial(){
    this.degree = 0;
    this.coeff = [];
}

function Polynomial(degree,coeff){ //grau e coeficientes (vetor)
    this.degree = degree;
    this.coeff = coeff;
}

Polynomial.prototype.evaluate_polynomial = function(u) { //polinomio e u
    var w = 1.0;
    var value = 0.0;
    var i;
    for (i=0; i<=this.degree; i++)
    {
        value += this.coeff[i]*w;
        w *= u;
    }
    return value;
}

Polynomial.prototype.showPolynomial = function() {
    console.log("degree: "+this.degree+" | coeff:["+this.coeff+"]");
}

function CurveBezier(){
    this.p_a = new Vec2();
    this.p_b = new Vec2();
    this.p_c = new Vec2();
    this.p_d = new Vec2();
    this.p_size=0;
    this.l_size=0;
}

function CurveBezier(p_a,p_b,p_c,p_d){
    this.p_a = p_a;
    this.p_b = p_b;
    this.p_c = p_c;
    this.p_d = p_d;
    this.p_size=0;
    this.l_size=0;
}

CurveBezier.prototype.a = function(){
    a = new Vec2();
    a.x = -1*this.p_a.x+3*this.p_b.x-3*this.p_c.x+1*this.p_d.x;
    a.y = -1*this.p_a.y+3*this.p_b.y-3*this.p_c.y+1*this.p_d.y;
    return a;
}

CurveBezier.prototype.b = function(){
    b = new Vec2();
    b.x = 3*this.p_a.x-6*this.p_b.x+3*this.p_c.x+0*this.p_d.x;
    b.y = 3*this.p_a.y-6*this.p_b.y+3*this.p_c.y+0*this.p_d.y;
    return b;
}

CurveBezier.prototype.c = function(){
    c = new Vec2();
    c.x = -3*this.p_a.x+3*this.p_b.x-0*this.p_c.x+0*this.p_d.x;
    c.y = -3*this.p_a.y+3*this.p_b.y-0*this.p_c.y+0*this.p_d.y;
    return c;
}

CurveBezier.prototype.evaluate = function(t) //parametro 0<=t<=1
{
    var b0,b1,b2,b3;
    b0 = -t*t*t + 3*t*t -3*t + 1;
    b1 = 3*t*t*t - 6*t*t + 3*t;
    b2 = -3*t*t*t +3*t*t;
    b3 = t*t*t;
    p = new Vec2();
    p.x = this.p_a.x*b0 + this.p_b.x*b1 + this.p_c.x*b2 + this.p_d.x*b3;
    p.y = this.p_a.y*b0 + this.p_b.y*b1 + this.p_c.y*b2 + this.p_d.y*b3;
    return p;
}

function ArcLength(){
    this.u1=0;
    this.u2=0;
    this.length=0;
    this.table=[]; //lista de Table_Entry
    this.curve= new CurveBezier();
    this.is_calculate = false;
}


ArcLength.prototype.integrate_func = function(func, interval) //interval é ArcLength
{
    var x =[.1488743389,.4333953941,.6794095682,.8650633666,.9739065285];
    var w =[.2966242247,.2692667193,.2190863625,.1494513491,.0666713443];
    var length, midu, dx, diff;
    var i;
    ua = interval.u1;
    ub = interval.u2;
    midu = (ua+ub)/2.0;
    diff = (ub-ua)/2.0;
    length = 0.0;
    for (var i=0; i<5; i++)
    {
        dx = diff*x[i];
        var pol1 = func.evaluate_polynomial(midu+dx);
        var pol2 = func.evaluate_polynomial(midu-dx);
        length += (Math.sqrt(pol1) + Math.sqrt(pol2))*w[i];
    }
    length *= diff;
    return length;
}
//ArcLength full_interval, Polynomial func, double total_length, double tolerance
function subdivide(arc,full_interval, func, total_length, tolerance,side)
{
    var left_interval = new Interval_Structure();
    var right_interval = new Interval_Structure();
    var left_length, right_length, midu, temp;
    
    midu = (full_interval.u1+full_interval.u2)/2.0;
    left_interval.u1 = full_interval.u1;
    left_interval.u2 = midu;
    right_interval.u1 = midu;
    right_interval.u2 = full_interval.u2;
    left_length = arc.integrate_func(func, left_interval);
    right_length = arc.integrate_func(func, right_interval);
    temp = Math.abs(full_interval.length - (left_length+right_length));
    if (temp > tolerance)
    {
        left_interval.length = left_length;
        right_interval.length = right_length;
        total_length = subdivide(arc,left_interval, func, total_length, tolerance/2.,"L");
        total_length = subdivide(arc,right_interval, func, total_length, tolerance/2.,"R");
        return total_length;//(this.subdivide(arc,left_interval, func, total_length, tolerance,"L") + this.subdivide(arc,right_interval, func, total_length, tolerance,"R"));
    }else{
        total_length = total_length + left_length;
        arc.table.push(new Table_Entry(midu,total_length));
        total_length = total_length + right_length;
        arc.table.push(new Table_Entry(full_interval.u2,total_length));
        return total_length;
    }
    
    

 }

 ArcLength.prototype.showTable = function(){
     for(var i=0;i<this.table.length;i++){
         this.table[i].showTableEntry();
     }
 }

ArcLength.prototype.adaptive_integration = function(curve, u1, u2, tolerance) {
    if (this.is_calculate) return;
    this.curve = curve;
    this.u1 = u1;
    this.u2 = u2;
    var func = new Polynomial();
    var full_interval = new Interval_Structure();
    total_length = 0;
    temp=0;

    a1 = curve.a();
    b1 = curve.b();
    c1 = curve.c();

    func.degree = 4;
    func.coeff = [0,0,0,0,0];
    func.coeff[4] = 9*(a1.x*a1.x + a1.y*a1.y);
    func.coeff[3] = 12*(a1.x*b1.x + a1.y*b1.y);
    func.coeff[2] = 6*(a1.x*c1.x + a1.y*c1.y) + 4*(b1.x*b1.x + b1.y*b1.y);
    func.coeff[1] = 4*(b1.x*c1.x +  b1.y*c1.y);
    func.coeff[0] = (c1.x*c1.x + c1.y*c1.y);

    full_interval.u1 = u1;
    full_interval.u2 = u2;

    temp = this.integrate_func(func, full_interval);

    //console.log("Initial guess = "+temp+"; "+u1+":"+u2);
    full_interval.length = temp;
    total_length = subdivide(this,full_interval, func, 0.0, tolerance);
    
    this.length = total_length;
    //console.log("Total: "+total_length);
    this.is_calculate = true;
    //alert(this.table.length);
}

ArcLength.prototype.getVec4S = function(curve,s)
{
    var indice = 0;
    for (var i = 1;i<this.table.length;i++){
        if(this.table[i].length >= s && this.table[i-1].length <= s){
            indice = i-1;
            break;
        }
    }
    var u = this.getU(indice,s);
    //console.log(u);
    return curve.evaluate(u);

}

ArcLength.prototype.getValueU = function(s)
{
    var indice = 0;
    for (var i = 1;i<this.table.length;i++){
        if(this.table[i].length >= s && this.table[i-1].length <= s){
            indice = i-1;
        }
    }
    var u = this.getU(indice,s);

    return u;

}

ArcLength.prototype.getU = function(indice,s)
{
    var u1,u2,s1,s2,u;

    u1 = this.table[indice].u;
    u2 = this.table[indice+1].u;

    s1 = this.table[indice].length;
    s2 = this.table[indice+1].length;
    u = (s*(2*u1*u2-u1*u1-u2*u2)) - ((u1*u2-u2*u2)*s1) - ((u1*u2-u1*u1)*s2);
    u = u/((u2-u1)*s1+(u1-u2)*s2);
    
    return u;


}

function exampleOfUse(){
    console.log("Example of use ArcLength");
    var p0 = new Vec2(0,0);
    var p1 = new Vec2(10,0);
    var p2 = new Vec2(10,10);
    var p3 = new Vec2(0,0);
    var curve = new CurveBezier(p0,p1,p2,p3);
    var arc = new ArcLength();
    arc.adaptive_integration(curve,0.0,1.0,0.0000001); //calculates the total arc length and save the table
    console.log("ArcLength:"+arc.length);
    var x = arc.length/2.0;
    var u = arc.getValueU(x); //returns the value of u given a length x;
    console.log("Parameter u="+u+", gives arc length = "+x);
    pu = arc.getVec4S(curve,x); //returns the point 2D given a length x;
    console.log("Parameter u="+u+", point: ("+pu.x+", "+pu.y+")");
    console.log("Example of use ArcLength End ***");
}

