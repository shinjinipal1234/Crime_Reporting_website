-- Insert crime types
INSERT INTO crime_types (name, description, severity_level) VALUES
('Theft', 'Unlawful taking of someone else\'s property', 'MEDIUM'),
('Assault', 'Physical attack on another person', 'HIGH'),
('Burglary', 'Breaking and entering into a building', 'HIGH'),
('Vandalism', 'Deliberate destruction of property', 'LOW'),
('Drug Offense', 'Illegal drug-related activities', 'MEDIUM'),
('Fraud', 'Deceptive practices for financial gain', 'MEDIUM'),
('Robbery', 'Theft involving force or threat', 'HIGH'),
('Domestic Violence', 'Violence within domestic relationships', 'CRITICAL'),
('Cybercrime', 'Computer and internet-related crimes', 'MEDIUM'),
('Traffic Violation', 'Violations of traffic laws', 'LOW');

-- Insert help articles
INSERT INTO help_articles (title, content, category) VALUES
('How to Report a Crime', 'To report a crime incident, navigate to the "Report Crime" section and fill out the detailed form with accurate information about the incident.', 'Reporting'),
('What Information to Include', 'When reporting a crime, include: exact location, time and date, detailed description, any witnesses, and supporting evidence if available.', 'Reporting'),
('Understanding Crime Status', 'Crime reports go through several statuses: Reported (initial submission), Investigating (under review), Resolved (case closed with resolution), Closed (case closed without resolution).', 'General'),
('Emergency vs Non-Emergency', 'For immediate emergencies, call 911. Use this system for non-emergency reporting and follow-up on existing cases.', 'Emergency'),
('Privacy and Confidentiality', 'Your personal information is protected. Only authorized personnel can access your reports, and your identity is kept confidential when possible.', 'Privacy'),
('How to Track Your Report', 'After submitting a report, you can track its status in your dashboard. You will receive updates as the case progresses.', 'Tracking');
