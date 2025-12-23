# print('Welcome to utility module with python')

class School:  
    def __init__(self, school_name, school_address, no_of_halls):  
        self.school_name = school_name 
        self.school_address = school_address 
        self.no_of_hall = no_of_halls 
        
        
    def school_details(self): 
         print(f"School Name : {self.school_name} \nSchool Address : {self.school_address} \nNumber of Halls : {self.no_of_hall}")
         
school1 = School("Greenwood High", "123 Maple St", 5)
school2 = School("Royal Model Academy", "234 Angel  St", 5)
print(school1.school_details())
print(school2.school_details())


"""
programming 
prgramming languages 
high level programming languages
python programming languages 
python is a high level programming language
javascript programming language
javascript is also a high level programming language
c++ programming language
c++ is also a high level programming language

low level programming langugages 
assembly language
machine level language
assembly language is a low level programming language


computer only understand 0s and 1s 
compiler 
interpreter 
translator 


python is an interpreted language 
"""