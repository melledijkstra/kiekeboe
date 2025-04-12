import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool? isAlive;

  Future<void> _checkStatus() async {
    final prefs = await SharedPreferences.getInstance();
    final databaseUri = prefs.getString('KEY_DATABASE_URI') ?? '';
    try {
      final response = await http.get(Uri.parse(databaseUri));
      setState(() {
        isAlive = response.statusCode == 200;
      });
    } catch (_) {
      setState(() {
        isAlive = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _checkStatus();
  }

  @override
  Widget build(BuildContext context) {
    Color color;

    if (isAlive == null) {
      color = CupertinoColors.systemGrey;
    } else {
      color = isAlive! ? CupertinoColors.systemGreen : CupertinoColors.systemRed;
    }

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('Welcome to Home',
            style: CupertinoTheme.of(context).textTheme.navTitleTextStyle),
        const SizedBox(height: 40),
        GestureDetector(
          child: Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          onTap: () {
            print('Check status');
            color = CupertinoColors.systemGrey;
            _checkStatus();
          },
        ),
      ],
    );
  }
}